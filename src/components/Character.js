import React, { useState, useEffect } from "react";
import char from "../assets/char.png";

const Character = ({
    onPositionUpdate,
    platforms,
    enemies,
    doubleJumpEnabled,
    onEnemyCollision,
}) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [jumpCount, setJumpCount] = useState(0);

    const CHARACTER_HEIGHT = 50;
    const CHARACTER_WIDTH = 30;

    const checkCollisionWithPlatforms = (x, y) => {
        for (const platform of platforms) {
            const isColliding =
                x + CHARACTER_WIDTH > platform.x &&
                x < platform.x + platform.width &&
                y + CHARACTER_HEIGHT >= platform.y &&
                y + CHARACTER_HEIGHT <= platform.y + 10;

            if (isColliding) return platform;
        }
        return null;
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
        if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
        if (e.key === " " && jumpCount < (doubleJumpEnabled ? 2 : 1)) {
            setVelocity((v) => ({ ...v, y: -15 }));
            setJumpCount((count) => count + 1);
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            setVelocity((v) => ({ ...v, x: 0 }));
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [jumpCount, doubleJumpEnabled]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prevPosition) => {
                let newX = prevPosition.x + velocity.x;
                let newY = prevPosition.y + velocity.y;

                const platform = checkCollisionWithPlatforms(newX, newY);
                if (platform && velocity.y >= 0) {
                    newY = platform.y - CHARACTER_HEIGHT;
                    setJumpCount(0);
                } else if (newY >= 400) {
                    onEnemyCollision(); // Reset when falling into void
                    return prevPosition;
                }

                onPositionUpdate({ x: newX, y: newY });
                return { x: newX, y: newY };
            });

            setVelocity((prevVelocity) => ({
                x: prevVelocity.x,
                y: Math.min(prevVelocity.y + 1, 10), // Gravity
            }));
        }, 30);

        return () => clearInterval(interval);
    }, [velocity, platforms, onEnemyCollision, onPositionUpdate]);

    return (
        <img
            src={char}
            alt="Character"
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "50px",
            }}
        />
    );
};

export default Character;
