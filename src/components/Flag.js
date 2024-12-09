import React from "react";
import flag from "../assets/flag.png";

const Flag = ({ x, y }) => {
    return (
        <div
            style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: "50px",
                height: "80px",
                backgroundImage: `url(${flag})`,
                backgroundSize: "cover",
                border: "2px solid white",
                boxShadow: "0 0 15px 3px rgba(255, 255, 0, 0.7)",
                animation: "flagWaving 2s infinite ease-in-out",
            }}
        ></div>
    );
};

export default Flag;
