import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { doc, getDoc, updateDoc, addDoc , collection} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import "./index.scss";
const MAX_SIZE = 1 * 1024 * 1024; // 1MB
function ClassPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [vocabExercises, setVocabExercises] = useState([]);
  const [fillInTheBlanksExercises, setFillInTheBlanksExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "classes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNotes(data.notes || "");
          setFiles(data.files || []);
          setTitle(data.title || "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    console.log("Files updated:", files);
  }, [files]);

  const saveNotes = async () => {
    try {
      await updateDoc(doc(db, "classes", id), {
        notes: notes,
      });
      alert("Notes saved!");
    } catch (err) {
      console.error(err);
    }
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const getBase64Size = (base64) => {
    let stringLength = base64.length - "data:image/png;base64,".length;
    let sizeInBytes = (stringLength * 3) / 4;
    return sizeInBytes;
  };
  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);

    try {
      // 1. convertir a base64
      const base64 = await fileToBase64(file);
      // 🚨 CHECK ANTES DE GUARDAR
      const size = getBase64Size(base64);
      console.log("File size in bytes:", size);
      if (size > MAX_SIZE) {
        alert("❌ File too large. Max allowed size is 1MB per class document.");
        setLoading(false);
        return;
      }

      const fileData = {
        data: base64,
        name: file.name,
        type: file.type,
      };

      // 2. actualizar estado
      const updatedFiles = [...files, fileData];
      setFiles(updatedFiles);

      // 3. guardar en firestore
      await updateDoc(doc(db, "classes", id), {
        files: updatedFiles,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };
  // ClassPage.jsx
  const generateVocab = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      // ✨ NO HACES JSON.parse si ya haces response.json()
      const data = await response.json();

      await addDoc(collection(db, "exercises"), {
        classId: id, // class id
        type: "flashcards",
        exercises: data,
        createdAt: serverTimestamp(),
      });
      console.log(data);
      // Guardar en state para mostrar en la página
      setVocabExercises(data);
    } catch (err) {
      console.error(err);
    }
  };
  const generateFillInTheBlanks = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/generate-fill-in-the-blanks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        },
      );

      const data = await response.json();
      console.log("Generated fill in the blanks:", data);
      await addDoc(collection(db, "exercises"), {
        classId: id, // class id
        type: "fillInTheBlanks",
        exercises: data,
        createdAt: serverTimestamp(),
      });
      console.log(data);
      // Guardar en state para mostrar en la página
      setFillInTheBlanksExercises(data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleInputChange = (index, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const checkAnswers = () => {
    let newScore = 0;

    vocabExercises.forEach((ex, index) => {
      const userAnswer = userAnswers[index]?.toLowerCase().trim();
      const correctAnswer = ex.answer.toLowerCase().trim();

      if (userAnswer === correctAnswer) {
        newScore += 1;
      }
    });

    setScore(newScore);
    setSubmitted(true);
  };

  const goToExercise = () => {
    generateVocab();
    navigate(`/exercise/${id}`, { state: { type: "vocab" } });
  };
  const goToExerciseFillInTheBlanks = () => {
    generateFillInTheBlanks();
    navigate(`/exercise2/${id}`, { state: { type: "fillInTheBlanks" } });
  };
  return (
    <div className="class-page">
      <h3 className="page-title">{title}</h3>

      {/* NOTES */}
      <div className="card">
        <div className="card-header">
          <h3>Notes</h3>
          <div>
            <button className="save-notes-btn" onClick={saveNotes}>
              Save
            </button>
          </div>
        </div>

        <textarea
          className="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your notes here..."
        />
        <div className="files-preview">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {/* IMÁGENES */}
              {file.type?.startsWith("image/") ? (
                <img src={file.data} alt={file.name} className="preview-img" />
              ) : (
                <iframe
                  src={file.data}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <p>Import Files</p>
          <input
            language="en"
            type="file"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
          <input
            language="en"
            type="file"
            multiple
            onChange={(e) => {
              Array.from(e.target.files).forEach((file) => uploadFile(file));
            }}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button className="primary-btn" onClick={goToExercise}>
          ⚡ Generate Vocabulary Exercise
        </button>

        <button className="secondary-btn" onClick={goToExerciseFillInTheBlanks}>
          ✍️ Fill in the Blanks Exercise
        </button>
      </div>

    </div>
  );
}

export default ClassPage;
