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
        }, 50);

        return () => clearInterval(interval);
    }, [direction, enemy]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "30px",
                backgroundColor: "red",
                border: "2px solid #8B0000",
                borderRadius: "50%",
                animation: "enemyMove 1.5s linear infinite",
                boxShadow: "0px 0px 10px 2px rgba(255, 0, 0, 0.75)",
            }}
        ></div>
    );
};

export default Enemy;
