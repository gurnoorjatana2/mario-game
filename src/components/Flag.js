import React from "react";
import flagImage from "../assets/flag.png";

const Flag = ({ x, y, width, height }) => {
    return (
        <div
            style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url(${flagImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        ></div>
    );
};

export default Flag;
