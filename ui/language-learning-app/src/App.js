import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./ui/pages/HomePage";
import ClassPage from "./ui/pages/ClassPage";
import ClassesPage from "./ui/pages/ClassesPage";
import SideBar from "./ui/components/SideBar";
import { useState } from "react";
import ExercisePage from "./ui/pages/ExercisePage";
import ExercisePage2 from "./ui/pages/Exercise2Page";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="App">
        <SideBar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ marginLeft: sidebarOpen ? '220px' : '70px', padding: '20px', transition: 'margin-left 0.3s ease', position: 'relative', zIndex: 1 , backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/class/:id" element={<ClassPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/exercise/:id" element={<ExercisePage />} />
            <Route path="/exercise2/:id" element={<ExercisePage2 />} />


          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
