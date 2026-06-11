import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import "./index.scss";
const MAX_SIZE = 1 * 1024 * 1024; // 1MB
function ClassPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [createdExerciseId, setCreatedExerciseId] = useState("");
  const [fillInTheBlanksExercises, setFillInTheBlanksExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "classes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNotes(data.notes || "");
          setImage(data.image || null);
          setTitle(data.title || "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    console.log("Image updated:", image);
  }, [image]);

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
      const base64 = await fileToBase64(file);

      const size = getBase64Size(base64);

      if (size > MAX_SIZE) {
        alert("❌ File too large. Max allowed size is 1MB.");
        setLoading(false);
        return;
      }

      const imageData = {
        data: base64,
        name: file.name,
        type: file.type,
      };

      setImage(imageData);

      await updateDoc(doc(db, "classes", id), {
        image: imageData,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };
  // ClassPage.jsx
  const generateVocab = async () => {
    setLoadingExercise(true);
    try {
      console.log("SEND TO BACKEND:", {
        notes,
        image: image,
      });
      const response = await fetch("http://127.0.0.1:8000/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes,
          image: image?.data || null,
        }),
      });

      const data = await response.json();

      const addedExercise = await addDoc(collection(db, "exercises"), {
        classId: id,
        type: "flashcards",
        exercises: data,
        createdAt: serverTimestamp(),
      });
      console.log("Generated vocab exercise:", addedExercise.id);
      // setCreatedExerciseId(addedExercise.id);
      return addedExercise.id;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExercise(false);
    }
  };
  const generateFillInTheBlanks = async () => {
    setLoadingExercise(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/generate-fill-in-the-blanks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes,
            image: image?.data || null,
          }),
        },
      );

      const data = await response.json();
      console.log("Generated fill in the blanks:", data);
      const addedExercise = await addDoc(collection(db, "exercises"), {
        classId: id, // class id
        type: "fillInTheBlanks",
        exercises: data,
        createdAt: serverTimestamp(),
      });
      console.log(data);
      // Guardar en state para mostrar en la página
      return addedExercise.id;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExercise(false);
    }
  };

  const handleInputChange = (index, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const goToExercise = async () => {
    const idEx = await generateVocab();
    console.log(idEx);
    navigate(`/exercise/${idEx}`, { state: { type: "vocab" } });
  };
  const goToExerciseFillInTheBlanks = async () => {
    const idEx = await generateFillInTheBlanks();
    navigate(`/exercise2/${idEx}`, {
      state: { type: "fillInTheBlanks" },
    });
  };
  if (loadingExercise) {
    return (
      <div className="loading-screen">
        <div className="glow" />
        <p>Generating exercises...</p>
      </div>
    );
  }
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
          {image && (
            <div className="file-item">
              <img src={image.data} alt={image.name} className="preview-img" />
            </div>
          )}
        </div>
        <div>
          <p>Import Files</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button
          className="primary-btn"
          onClick={goToExercise}
          disabled={loadingExercise}
        >
          ⚡ Generate Vocabulary Exercise
        </button>

        <button
          className="secondary-btn"
          onClick={goToExerciseFillInTheBlanks}
          disabled={loadingExercise}
        >
          ✍️ Fill in the Blanks Exercise
        </button>
      </div>
    </div>
  );
}

export default ClassPage;
