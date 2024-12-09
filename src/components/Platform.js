import React from "react";

const Platform = ({ x, y, width, height, color }) => {
    return (
        <div
            style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: color,
                border: "1px solid #444",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        ></div>
    );
};

export default Platform;
