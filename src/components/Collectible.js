import React, { useState, useEffect } from "react";

const Collectible = ({ x, y, playerPosition, onCollect }) => {
    const [collected, setCollected] = useState(false);

    useEffect(() => {
        if (!collected) {
            const isCollected =
                playerPosition.x < x + 20 &&
                playerPosition.x + 30 > x &&
                playerPosition.y < y + 20 &&
                playerPosition.y + 30 > y;

            if (isCollected) {
                setCollected(true); // Update local state
                onCollect(); // Trigger parent state update
            }
        }
    }, [playerPosition, collected, x, y, onCollect]);

    if (collected) return null;

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
            }}
        ></div>
    );
};

export default Collectible;

