import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import TopNav from "../components/topNav";

export default function Home(){
    return(
        <div className="home">
        <TopNav/>
        </div>
        
    );
}