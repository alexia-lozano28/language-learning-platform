import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./ui/pages/HomePage";
import ClassPage from "./ui/pages/ClassPage";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/class/:id" element={<ClassPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
