// src/components/HomePage.jsx
import { db } from "../firebase";

import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";

function HomePage() {
  const [titulo, setTitulo] = useState("");

  const crearClase = async () => {
    try {
      await addDoc(collection(db, "clases"), {
        titulo: titulo,
        apuntes: "",
        ejercicios: [],
        createdAt: new Date(),
      });
      setTitulo("");
      alert("Clase creada!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Clases</h1>
      <input
        placeholder="Título de la clase"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button onClick={crearClase}>+ Nueva Clase</button>
    </div>
  );
}

export default HomePage;