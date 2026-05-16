import { db } from "../../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";

import { FaBook, FaDumbbell, FaLanguage } from "react-icons/fa";
function ClassesPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const user = "alexialozp@gmail.com"; // TODO: Get from auth

  const openNotes = (id) => {
    navigate("/class/" + id);
  };
  const retrieveAll = async (user) => {
    const q = query(collection(db, "classes"), where("user", "==", user));
    const querySnapshot = await getDocs(q);
    const classesArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setHistory(classesArray);
  };

  useEffect(() => {
    retrieveAll(user);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Classes</h2>

      <div className="tableContainer">
        {history.slice(0, 3).map((clase) => (
          <div className="tableRow" key={clase.id}>
            <div className="tableCell title">{clase.title}</div>
            <div className="tableCell-exercises">
              {clase.exercises ? clase.exercises.length : 0}
            </div>
            <div className="tableCell-created">
              Created:{" "}
              {clase.createdAt
                ? new Date(clase.createdAt.seconds * 1000).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="tableCell action">
              <button onClick={() => openNotes(clase.id)}>Go to lesson</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ClassesPage;
