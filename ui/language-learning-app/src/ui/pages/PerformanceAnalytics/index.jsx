import React, { useEffect } from "react";
import "./index.scss";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  setDoc,
  arrayUnion,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
function PerformanceAnalysisPage() {
  const [performanceData, setPerformanceData] = React.useState({});
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "user_activity"),
        where("user", "==", "alexialozp@gmail.com"),
      );
      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      const analytics = dataArray[0] || {};
      console.log("Fetched performance data:", analytics);
      setPerformanceData(analytics); // Assuming we want the first document for this user
    };
    fetchData();
    // Fetch performance data from Firestore
  }, []);
  return (
    <div className="performance-analytics-page">
      <div className="page-header">
        <h2>Performance Analytics</h2>
      <p>Track your evaluation from understanding to mastery </p>
      </div>
      
      <div className="level-progress">
        <span className="card-label">Current Level</span>

        <div className="level-circle">
          <h1>{performanceData?.general?.level}</h1>
        </div>

        <div className="stats-column">
          <div className="mini-stat">
            <span>XP</span>
            <strong>{performanceData?.general?.xp}</strong>
          </div>
          <div className="mini-stat">
            <span>Accuracy</span>
            <strong>{performanceData?.general?.accuracy}%</strong>
          </div>
          <div className="mini-stat">
            <span>Streak</span>
            <strong>{performanceData?.general?.streakDays} days</strong>
          </div>{" "}
        </div>
      </div>
      <div className="type-exercises">
        <div className="card-title-row">
          <h3>Exercise Types</h3>
        </div>

        {Object.entries(performanceData?.exerciseTypes || {}).map(([key, value]) => (
          <div className="exercise-row" key={key}>
            <div className="exercise-info">
              <span>{key.replace("_", " ")}</span>
              <small>{value.completed} completed</small>
            </div>

            <div className="exercise-bar-wrapper">
              <div
                className="exercise-bar"
                style={{ width: `${value.accuracy}%` }}
              ></div>
            </div>

            <strong>{value.accuracy}%</strong>
          </div>
        ))}
      </div>
      <div className="weak-spots">
        <h3>Weak Spots</h3>

        {performanceData?.weakTopics?.map((topic) => (
          <div className="weak-topic" key={topic.topic}>
            <span>{topic.topic}</span>
            <strong>{topic.accuracy}%</strong>
          </div>
        ))}
      </div>
      <div className="activity-heatmap">
        <h3>Weekly Activity</h3>

        <div className="heatmap-grid">
          {Object.entries(performanceData?.monthlyActivity || {}).map(([day, value]) => (
            <div className="heatmap-cell-wrapper" key={day}>
              <div
                className="heatmap-cell"
                style={{ opacity: Math.max(value / 20, 0.2) }}
              >
                {value}
              </div>

              <span>{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerformanceAnalysisPage;
