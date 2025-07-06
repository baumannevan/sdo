import React from "react";
import { Link } from "react-router-dom";
import "../styles/topNav.css";
import TopNav from "../components/topNav";


export default function Home(){
    return(
        <div className="profile-container">
            <TopNav/>
        </div>
        
    );
}