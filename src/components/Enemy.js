import React, { useState, useEffect } from "react";

const Enemy = ({ enemy, playerPosition, onEnemyCollision }) => {
    const [position, setPosition] = useState({ x: enemy.x, y: enemy.y });
    const [direction, setDirection] = useState(1); // 1 for moving right, -1 for moving left

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((pos) => {
                const newX = pos.x + direction * 2; // Adjust speed by changing 2
                // Reverse direction if it goes out of bounds
                if (newX <= enemy.x - 50 || newX >= enemy.x + 50) {
                    setDirection((d) => -d); // Reverse direction
                }
                return { x: newX, y: pos.y };
            });
        }, 50); // Adjust interval for smoother or faster motion

        return () => clearInterval(interval);
    }, [enemy.x, direction]);

    // Check collision with player
    useEffect(() => {
        const isColliding =
            playerPosition.x + 30 > position.x && // Character's right edge > enemy's left edge
            playerPosition.x < position.x + 30 && // Character's left edge < enemy's right edge
            playerPosition.y + 30 > position.y && // Character's bottom edge > enemy's top edge
            playerPosition.y < position.y + 30; // Character's top edge < enemy's bottom edge

        const wasJumpedOn =
            playerPosition.y + 30 >= position.y && playerPosition.y < position.y; // Character lands on the enemy

        if (isColliding) {
            onEnemyCollision(enemy.id, wasJumpedOn);
        }
    }, [playerPosition, position, onEnemyCollision, enemy.id]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "30px",
                backgroundColor: "green",
            }}
        ></div>
    );
};

export default Enemy;
