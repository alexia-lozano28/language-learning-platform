import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { FaBook, FaDumbbell, FaLanguage } from "react-icons/fa";
import CreateClassForm from "../../components/Modals/CreateClass";
function HomePage() {
  const [historyClasses, sethistoryClasses] = useState([]);
  const [historyExercises, sethistoryExercises] = useState([]);
  const [createClassOpen, setCreateClassOpen] = useState(false);
  const navigate = useNavigate();

  const retrieveAll = async (user) => {
    const q = query(
      collection(db, "classes"),
      where("user", "==", user),
      orderBy("createdAt", "desc"),
    );
    const q2 = query(collection(db, "exercises"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const classesArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const querySnapshot2 = await getDocs(q2);
    const exercisesArray = querySnapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    sethistoryClasses(classesArray);
    console.log("Fetched classes:", exercisesArray);
    sethistoryExercises(exercisesArray);
  };

  const openNotes = (id) => {
    navigate("/class/" + id);
  };
  const openExercises = (exercise) => {
    const { id, type } = exercise;
    if(type === "flashcards"){
      navigate("/exercise/" + id, { state: { type: "flashcards" } });
    } else if(type === "fillInTheBlanks"){
      navigate("/exercise2/" + id, { state: { type: "fillInTheBlanks" } });
    }
  };
  useEffect(() => {
    retrieveAll("alexialozp@gmail.com");
  }, []);
  useEffect(() => {
    retrieveAll("alexialozp@gmail.com");
  }, [createClassOpen]);
  return (
    <div style={{ marginLeft: "20px" }}>
      <div className="welcomeTitle">
        <div className="welcomeSubtitle">Wilkommen Züruck</div>
        <div className="welcomeMessage">Guten Morgen, Alexia !</div>
      </div>
      <div>
        <h3 style={{ textAlign: "left" }}>Actions</h3>
      </div>

      <div className="containerHomePageActions">
        <div className="cardHomePage">
          <div className="card-icon-circle class-circle">
            <FaBook />
          </div>
          <div className="card-title" onClick={() => setCreateClassOpen(true)}>
            <h4>Create Class</h4>
            <p>Start taking notes</p>
          </div>
        </div>
        <div className="cardHomePage">
          <div className="card-icon-circle exercise-circle">
            <FaDumbbell />
          </div>
          <div className="card-title">
            <h4>Practice</h4>
            <p>Improve your skills</p>
          </div>
        </div>
        <div className="cardHomePage">
          <div className="card-icon-circle vocab-circle">
            <FaLanguage />
          </div>
          <div className="card-title" onClick={() => navigate("/dictionary")}>
            <h4>Open Vocabulary Sheet</h4>
            <p>Review your words</p>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h3 style={{ textAlign: "left" }}>Last Classes</h3>
        </div>

        <div className="tableContainer">
          {historyClasses.slice(0, 3).map((clase) => (
            <div className="tableRow" key={clase.id}>
              <div className="row-title">
                <span className="icon-circle class-circle">
                  <FaBook />
                </span>
                <div className="tableCell title">{clase.title}</div>
              </div>
              <div className="tableCell action">
                <button onClick={() => openNotes(clase.id)}>Check</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ textAlign: "left" }}>Last Exercises</h3>
        </div>
        <div className="tableContainer">
          {historyExercises.slice(0, 3).map((exercise) => (
            <div className="tableRow" key={exercise.id}>
              <div className="row-title">
                <span className="icon-circle exercise-circle">
                  <FaDumbbell />
                </span>
                <div className="tableCell title">{exercise.type}</div>
                <div>{exercise.createdAt?.toDate().toLocaleString()}</div>
              </div>
              <div className="tableCell action">
                <button onClick={() => openExercises(exercise)}>
                  Let's practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {createClassOpen ? (
        <CreateClassForm
          setIsOpen={setCreateClassOpen}
          isOpen={createClassOpen}
        ></CreateClassForm>
      ) : null}

      {/* <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createClass}>+ New Class</button>

      ))} */}
    </div>
  );
}

export default HomePage;
