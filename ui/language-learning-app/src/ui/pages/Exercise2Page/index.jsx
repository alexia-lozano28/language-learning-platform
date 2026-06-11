import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc , query, collection, where, getDocs} from "firebase/firestore";
import "./index.scss";

function ExercisePage2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        console.log("Fetching exercise data for ID:", id);
        const docRef = doc(db, "exercises", id);
        const docSnap = await getDoc(docRef);
        console.log("Document snapshot:", docSnap);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched exercise data:", data);
          setCards(data.exercises);
        } else {
          alert("No exercise found for this ID.");
        }
      };
      fetchData();
    }, [id]);

  const currentCard = cards[currentIndex];

  const normalize = (str) => str?.trim().toLowerCase();

  const checkAnswer = () => {
    const correct =
      normalize(input) === normalize(currentCard.answer);

    setIsCorrect(correct);
    setShowAnswer(true);

    const answerEntry = {
      word: currentCard.word || currentCard.sentence,
      correctAnswer: currentCard.answer,
      userAnswer: input,
      isCorrect: correct,
    };

    setUserAnswers((prev) => [...prev, answerEntry]);

    if (correct) setScore((s) => s + 1);
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

  // Detect type
  const isFillGap = currentCard.sentence;

  return (
    <div className="exercise-layout">
      <button
        onClick={() => {
          navigate(`/class/${id}`);
        }}
      >
        ← Back to Class
      </button>
      {!finished ? (
        <>
          {/* HEADER */}
          <div className="header">
            {/* <button onClick={() => navigate(`/class/${id}`)}>←</button> */}
            <span>FILL THE GAPS</span>
            <span>
              {currentIndex + 1} / {cards.length}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>

          {/* CARD */}
          <div className="content">
            <div className="flashcard">

              {/* SENTENCE MODE */}
              {isFillGap ? (
                <h2 className="sentence">
                  {currentCard.sentence.split("___")[0]}

                  <span className="gap">
                    {input || "_____"}
                  </span>

                  {currentCard.sentence.split("___")[1]}
                </h2>
              ) : (
                <>
                  <span className="direction">Translate</span>
                  <h1>{currentCard.word}</h1>
                </>
              )}

              {/* INPUT */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type answer..."
                disabled={showAnswer}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !showAnswer) {
                    checkAnswer();
                  }
                }}
              />

              {/* FEEDBACK */}
              {showAnswer && (
                <div className="feedback">
                  <p className={isCorrect ? "correct" : "wrong"}>
                    {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                  </p>

                  {!isCorrect && (
                    <p>
                      Correct: <b>{currentCard.answer}</b>
                    </p>
                  )}

                  {isFillGap && (
                    <p className="correct-sentence">
                      {currentCard.sentence.replace(
                        "___",
                        currentCard.answer
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* BUTTON */}
            <div className="actions">
              {!showAnswer ? (
                <button onClick={checkAnswer}>Submit</button>
              ) : (
                <button onClick={handleNext}>Next →</button>
              )}
            </div>

            {/* INFO CARDS */}
            <div className="info-row">
              {/* <div className="info-card">
                <h4>Grammar</h4>
                <p>Reflexive verb</p>
              </div> */}

              <div className="info-card">
                <h4>Type</h4>
                <p>{isFillGap ? "Fill gap" : "Translate"}</p>
              </div>

              <div className="info-card">
                <h4>Progress</h4>
                <p>{currentIndex + 1} / {cards.length}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="results-page">
          <h2>🎉 Finished!</h2>
          <p>
            Score: {score} / {cards.length}
          </p>

          <button onClick={saveResults}>
            💾 Save Results
          </button>

          <div className="review">
            {userAnswers.map((a, i) => (
              <div key={i} className="review-item">
                <strong>{a.word}</strong>

                <p style={{ color: a.isCorrect ? "green" : "red" }}>
                  {a.userAnswer || "—"}
                </p>

                {!a.isCorrect && (
                  <p>Correct: {a.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExercisePage2;