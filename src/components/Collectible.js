import React, { useEffect } from "react";

const Collectible = ({ x, y, playerPosition, onCollect }) => {
    useEffect(() => {
        const isCollected =
            playerPosition.x < x + 20 &&
            playerPosition.x + 30 > x &&
            playerPosition.y < y + 20 &&
            playerPosition.y + 50 > y; // Adjust for character's height

        if (isCollected) {
            onCollect(); // Trigger parent state update when collected
        }
    }, [playerPosition, x, y, onCollect]);

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
                boxShadow: "0 0 5px rgba(255, 215, 0, 0.8)", // Glow effect
            }}
        ></div>
    );
};

export default Collectible;
