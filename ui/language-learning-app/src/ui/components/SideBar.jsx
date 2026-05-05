import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import { FaBook, FaDumbbell, FaLanguage , FaHouseUser, FaChartBar} from "react-icons/fa";

function SideBar({ isOpen, onToggle }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {isOpen && <h2>Navigation</h2>}
        <button className="toggle-btn" onClick={onToggle}>
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <ul className="sidebar-menu">
        <li>
          <Link to="/">
            <span className="icon"><FaHouseUser /></span>
            {isOpen && <span>Home</span>}
          </Link>
        </li>

        <li>
          <Link to="/classes">
            <span className="icon"><FaBook /></span>
            {isOpen && <span>Notes</span>}
          </Link>
        </li>
        <li>
          <Link to="/dictionary">
            <span className="icon"><FaLanguage /></span>
            {isOpen && <span>Dictionary</span>}
          </Link>
        </li>
        <li>
          <Link to="/classes">
            <span className="icon"><FaDumbbell /></span>
            {isOpen && <span>Practice</span>}
          </Link>
        </li>
        <li>
          <li>
          <Link to="/profile">
            <span className="icon"><FaChartBar /></span>
            {isOpen && <span>Insights</span>}
          </Link>
        </li>
          <Link to="/profile">
            <span className="icon"><FaHouseUser /></span>
            {isOpen && <span>Profile</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;