import React, { useState, useEffect } from "react";

const Enemy = ({ enemy, playerPosition, onEnemyCollision }) => {
    const [position, setPosition] = useState({ x: enemy.x, y: enemy.y });
    const [direction, setDirection] = useState(enemy.direction);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prevPosition) => {
                let newX = prevPosition.x + direction * enemy.speed;
                if (newX > enemy.x + enemy.range || newX < enemy.x - enemy.range) {
                    setDirection((d) => -d);
                }
                return { ...prevPosition, x: newX };
            });

            // Check for collision with player
            if (
                playerPosition.x < position.x + 30 &&
                playerPosition.x + 30 > position.x &&
                playerPosition.y < position.y + 30 &&
                playerPosition.y + 50 > position.y
            ) {
                onEnemyCollision();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [direction, enemy, playerPosition, position, onEnemyCollision]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "30px",
                backgroundColor: "red",
                borderRadius: "50%",
                boxShadow: "0px 0px 10px 2px rgba(255, 0, 0, 0.75)",
            }}
        ></div>
    );
};

export default Enemy;
