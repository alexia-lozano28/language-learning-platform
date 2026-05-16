import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebase";

function DictionaryPage() {
  const [words, setWords] = useState([]);
  const [filterWords, setFilterWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dictionaryId, setDictionaryId] = useState(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const q = query(
          collection(db, "dictionary"),
          where("user", "==", "alexialozp@gmail.com"),
        );
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setDictionaryId(docSnap.id);
          const data = docSnap.data();
          setWords(data.dictionary || []);
          setFilterWords(data.dictionary || []);
          setLoading(false);
        } else {
          console.log("No dictionary found for this user.");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDictionary();
  }, []);
  useEffect(() => {

    const filtered = words.filter((item) => {
      const word = item.word?.toLowerCase() || "";
      const translation = item.translation?.toLowerCase() || "";
      const value = searchTerm.toLowerCase();

      return word.includes(value) || translation.includes(value);
    });

    setFilterWords(filtered);
  }, [searchTerm, words]);

  const deleteWord = async (wordToDelete) => {
    try {
      const updatedWords = words.filter((item) => item.word !== wordToDelete);

      setWords(updatedWords);

      await updateDoc(doc(db, "dictionary", dictionaryId), {
        dictionary: updatedWords,
      });
    } catch (err) {
      console.error(err);
    }
  };
  const totalWords = useMemo(() => words.length, [words]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="dictionary-loading">Loading...</div>;
  }
  return (
    <div className="dictionary-page">
      {/* HEADER */}
      <div className="dictionary-header">
        <div>
          <h2>Personal Dictionary</h2>
          <p>Save and review your vocabulary anytime.</p>
        </div>

        <div className="dictionary-stat-card">
          <span>Total Words</span>
          <strong>{totalWords}</strong>
        </div>
      </div>

      {/* SEARCH */}
      <div className="dictionary-search">
        <input
          type="text"
          placeholder="Search word or translation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* EMPTY */}
      {filterWords.length === 0 ? (
        <div className="empty-state">
          <h3>No words found</h3>
          <p>Try another search or save new vocabulary.</p>
        </div>
      ) : (
        <div className="dictionary-grid">
          {filterWords.map((item, idx) => (
            <div className="dictionary-card" key={idx}>
              <div className="dictionary-card-top">
                <h2>{item.word}</h2>

                <button
                  className="delete-btn"
                  onClick={() => deleteWord(item.word)}
                >
                  ✕
                </button>
              </div>

              <p>{item.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DictionaryPage;
