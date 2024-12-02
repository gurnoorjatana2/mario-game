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
            }}
        ></div>
    );
};

export default Platform;

