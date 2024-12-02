import React from "react";

const Platform = ({ x, y, width, height }) => {
    return (
        <div
            style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "brown",
            }}
        ></div>
    );
};

export default Platform;
