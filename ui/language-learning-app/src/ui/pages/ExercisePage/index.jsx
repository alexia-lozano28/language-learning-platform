import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function ExercisePage() {
  const { id } = useParams();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState([]);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "classes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setCards(data.exercises || []);
        setResults(data.exerciseResults || []);
      }
    };

    fetchData();
  }, [id]);

  // CHECK ANSWER
  const checkAnswer = () => {
    const current = cards[currentIndex];

    const correct =
      input.trim().toLowerCase() === current.answer.trim().toLowerCase();

    setIsCorrect(correct);
    setShowAnswer(true);

    const answerEntry = {
      word: current.word,
      correctAnswer: current.answer,
      userAnswer: input,
      isCorrect: correct,
    };

    setUserAnswers((prev) => [...prev, answerEntry]);

    if (correct) setScore((s) => s + 1);
  };

  // NEXT CARD
  const nextCard = () => {
    setInput("");

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };
  const handleNext = () => {
    setInput("");
    setShowAnswer(false);
    setIsCorrect(null);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  // SAVE RESULTS
  const saveResults = async () => {
    const docRef = doc(db, "classes", id);
    const snap = await getDoc(docRef);

    const prev = snap.data()?.exerciseResults || [];

    const newResult = {
      score,
      total: cards.length,
      date: new Date(),
      answers: userAnswers,
    };

    await updateDoc(docRef, {
      exerciseResults: [...prev, newResult],
    });

    alert("Results saved!");
  };

  if (!cards.length) return <div>Loading...</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="exercise-general-page">
      <button
        onClick={() => {
          navigate(`/class/${id}`);
        }}
      >
        ← Back to Class
      </button>
      {/* ===================== */}
      {/* ACTIVE EXERCISE */}
      {/* ===================== */}
      {!finished ? (
        <div className="exercise-layout">
          {/* HEADER */}
          <div className="header">
            {/* <button onClick={() => navigate(`/class/${id}`)}>←</button> */}
            <span>FLASHCARDS</span>
            <span className="counter">
              {currentIndex + 1} / {cards.length} Words
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>

          {/* MAIN CONTENT */}
          <div className="content">
            {/* CARD */}
            <div className="flashcard">
              <span className="direction">DE → EN</span>

              <h1>{currentCard.word}</h1>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type translation..."
                disabled={showAnswer}
              />

              {showAnswer && (
                <div className="feedback">
                  <p className={isCorrect ? "correct" : "wrong"}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>

                  {!isCorrect && <p>{currentCard.answer}</p>}
                </div>
              )}
            </div>

            {/* BUTTON AREA */}
            <div className="actions">
              {!showAnswer ? (
                <button onClick={checkAnswer}>Submit</button>
              ) : (
                <button onClick={handleNext}>Next</button>
              )}
            </div>

            {/* INFO CARDS */}
            <div className="info-row">
              <div className="info-card">
                <h4>Grammar Tip</h4>
                <p>{currentCard.grammarTip}</p>
              </div>

              <div className="info-card">
                <h4>Compound</h4>
                <p>{currentCard.word}</p>
              </div>

              <div className="info-card">
                <h4>Repetition</h4>
                <p>{currentIndex + 1} times</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ===================== */
        /* FINISHED + HISTORY */
        /* ===================== */
        <div className="results-page">
          <h2>🎉 Finished!</h2>

          <p>
            Score: {score} / {cards.length}
          </p>

          <button className="primary-btn" onClick={saveResults}>
            💾 Save Results
          </button>
          <div className="review">
            <h3>📝 Your Answers</h3>

            {userAnswers.map((a, idx) => (
              <div key={idx} className="review-item">
                <strong>{a.word}</strong>

                <div>
                  Your answer:{" "}
                  <span
                    style={{
                      color: a.isCorrect ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {a.userAnswer || "—"}
                  </span>
                </div>

                {!a.isCorrect && (
                  <div>
                    Correct: <b>{a.correctAnswer}</b>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* HISTORY */}
          {/* {results.length > 0 && (
            <div className="card">
              <h3>📊 History</h3>

              {results.map((r, i) => (
                <div key={i} className="result-block">
                  <p>
                    Score: {r.score}/{r.total}
                  </p>

                  <p>
                    {r.date?.seconds
                      ? new Date(r.date.seconds * 1000).toLocaleString()
                      : new Date(r.date).toLocaleString()}
                  </p>

       
                  <div className="review">
                    {r.answers?.map((a, idx) => (
                      <div key={idx} className="review-item">
                        <strong>{a.word}</strong>

                        <div>
                          Your answer:{" "}
                          <span
                            style={{
                              color: a.isCorrect ? "green" : "red",
                            }}
                          >
                            {a.userAnswer}
                          </span>
                        </div>

                        {!a.isCorrect && (
                          <div>
                            Correct: <b>{a.correctAnswer}</b>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div> 
               ))}
            </div>
          )}*/}
        </div>
      )}
    </div>
  );
}

export default ExercisePage;
