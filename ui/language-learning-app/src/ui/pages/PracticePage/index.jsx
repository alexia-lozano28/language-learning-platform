import React ,{useEffect}from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./index.scss";
function PracticePage() {
    const navigate = useNavigate();
    const [historyExercises, sethistoryExercises] = React.useState([]);
  const retrieveAll = async (user) => {

    const q2 = query(collection(db, "exercises"), orderBy("createdAt", "desc"));
    const querySnapshot2 = await getDocs(q2);
    const exercisesArray = querySnapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched exercises:", exercisesArray);
    
    sethistoryExercises(exercisesArray);
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
  return (
    // TODO: show the exercise with to which class it belongs and the redirecting working properly
    <div>
      {" "}
      <div>
        <h3>Last Exercises</h3>
      </div>
      <div className="tableContainer">
        {historyExercises.map((exercise) => (
          <div className="tableRow" key={exercise.id}>
            <div className="row-title">
              {/* <span className="icon-circle exercise-circle">
                <FaDumbbell />
              </span> */}
              <div className="tableCell title">{exercise.type}</div>
              <div className="tableCell title">{exercise.createdAt?.toDate().toLocaleString()}</div>
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
  );
}

export default PracticePage;
