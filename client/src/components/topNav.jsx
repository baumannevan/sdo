import React from "react";
import { Link } from "react-router-dom";

const TopNav = () => (
    <div className="top-nav">
        <div>sigma delta omega</div>
        <button type="button" className="profile">
            <Link to="/profile">Profile</Link>
        </button>
    </div>
);

export default TopNav;