// src/components/HomePage.jsx
import { db } from "../../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
function HomePage() {
  const [title, setTitle] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const createClass = async () => {
    try {
      await addDoc(collection(db, "classes"), {
        title: title,
        notes: "",
        exercises: [],
        createdAt: new Date(),
      });
      setTitle("");
      alert("Created Class!");
      retrieveAll(); // refrescar lista
    } catch (err) {
      console.error(err);
    }
  };

  const retrieveAll = async () => {
    const querySnapshot = await getDocs(collection(db, "classes"));
    const classesArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setHistory(classesArray);
  };

  const openNotes = (id) =>{
    navigate("/class/"+ id)
  }
  useEffect(() => {
    retrieveAll();
  }, []);

  return (
    <div>
      <h1>Classes</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createClass}>+ New Class</button>

      <h2>My Classes:</h2>
      {history.map((clase) => (
        <button onClick={() => openNotes(clase.id)} key={clase.id}>
          <p>{clase.title}</p>
        </button>
      ))}
    </div>
  );
}

export default HomePage;