import React, { Component } from "react";
import "./modals.scss";
// import {button} from "react-bootstrap";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function CreateClassForm({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  //   const createClass = () => {
  //     setIsOpen(false);
  //     console.log("closing modal");
  //   };
  const [title, setTitle] = useState("");

  const closeModal = () => {
    setIsOpen(false);
    console.log("closing modal");
  };

  const createClass = async () => {
    if (!title) {
      alert("Please enter a class name");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "classes"), {
        title: title,
        notes: "",
        exercises: [],
        createdAt: new Date(),
        user: "alexialozp@gmail.com",
      });

      setTitle("");
      alert("Created Class!");
      navigate("/class/" + docRef.id);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => closeModal()}>
      <div className="modalForm" onClick={(e) => e.stopPropagation()}>
        <h4>Create New Class</h4>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            placeholder="Enter class name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <div className="button-group">
            <button className="create-button" onClick={() => createClass()}>
              Create
            </button>
            <button className="close-button" onClick={() => closeModal()}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClassForm;
