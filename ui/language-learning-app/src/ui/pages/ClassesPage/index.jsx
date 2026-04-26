import { db } from "../../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./index.scss";

import { FaBook, FaDumbbell, FaLanguage } from "react-icons/fa";
function ClassesPage(){
    const [history, setHistory] = useState([]);
    const user = "alexialozp@gmail.com"; // TODO: Get from auth

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
        <div style={{ padding: '20px' }}>
            <h2>All Classes</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Notes</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Exercises</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((cls) => (
                        <tr key={cls.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.title}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.notes || 'No notes'}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.exercises ? cls.exercises.length : 0}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.createdAt ? new Date(cls.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ClassesPage;