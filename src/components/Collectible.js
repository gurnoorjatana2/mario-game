import React from "react";

const Collectible = ({ x, y, playerPosition, onCollect }) => {
    const isCollected =
        playerPosition.x < x + 20 &&
        playerPosition.x + 30 > x &&
        playerPosition.y < y + 20 &&
        playerPosition.y + 50 > y;

    if (isCollected) {
        onCollect();
        return null;
    }

    return (
        <div
            style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: "20px",
                height: "20px",
                backgroundColor: "gold",
                borderRadius: "50%",
                border: "2px solid orange",
            }}
        ></div>
    );
};

export default Collectible;
