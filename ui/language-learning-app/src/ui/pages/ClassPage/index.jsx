import React, { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";

function ClassPage() {
  const { id } = useParams();

  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [vocabExercises, setVocabExercises] = useState([]);

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

  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);

    try {
      const fileRef = ref(storage, `classes/${id}/${Date.now()}_${file.name}`);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      const updatedFiles = [...files, url];
      setFiles(updatedFiles);

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
      const response = await fetch(`http://127.0.0.1:8000/api/generate-vocab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      // ✨ NO HACES JSON.parse si ya haces response.json()
      const data = await response.json();
      console.log("Generated vocab:", data);

      // Guardar en state para mostrar en la página
      setVocabExercises(data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Class {title}</h2>

      {/* 📝 NOTES */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Notes</h3>
        <textarea
          style={{ width: "100%", height: "150px", padding: "10px" }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button onClick={saveNotes} style={{ marginTop: "10px" }}>
          Save notes
        </button>
      </div>

      {/* 📂 FILE UPLOAD
      <div style={{ marginBottom: "20px" }}>
        <h3>Upload file</h3>
        <input
          type="file"
          onChange={(e) => uploadFile(e.target.files[0])}
        />
        {loading && <p>Uploading...</p>}
      </div>

      
      <div>
        <h3>Files</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              {file.includes(".pdf") ? (
                <a href={file} target="_blank" rel="noreferrer">
                  📄 Open PDF
                </a>
              ) : (
                <img
                  src={file}
                  alt="uploaded"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* 🚀 FUTURE BUTTONS */}
      <div style={{ marginTop: "30px" }}>
        <button onClick={generateVocab}>Create vocab exercise</button>
        <button style={{ marginLeft: "10px" }}>Create grammar exercise</button>
      </div>
      <div>
        <button onClick={generateVocab}>Generar vocab</button>

        {vocabExercises.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Ejercicios de vocabulario:</h3>
            {/* <ul>
              {vocabExercises.map((ex, index) => (
                <li key={index}>
                  <strong>{ex.word}</strong>: {ex.definition} <br />
                  Ejemplo: {ex.sentence} <br />
                  Traducción: {ex.translation}
                </li>
              ))}
            </ul> */}
            {JSON.stringify(vocabExercises)}
          </div>
        )}
         {JSON.stringify(vocabExercises)}
      </div>
    </div>
  );
}

export default ClassPage;
