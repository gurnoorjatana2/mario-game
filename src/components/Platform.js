import React from "react";

const Platform = ({ x, y, width, height, color = "brown" }) => {
    return (
        <div
            style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: color,
                border: "2px solid black", // Add border for better visibility
                borderRadius: "5px", // Slightly rounded edges for aesthetics
                zIndex: 1, // Ensure platforms appear above the background
            }}
        ></div>
    );
};

export default Platform;
