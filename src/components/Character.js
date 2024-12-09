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
    const [isJumping, setIsJumping] = useState(false);
    const [jumpCount, setJumpCount] = useState(0);

    const CHARACTER_HEIGHT = 50;
    const CHARACTER_WIDTH = 30;
    const GROUND_LEVEL = 380;

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

    const checkCollisionWithEnemies = (x, y) => {
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;

            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + 30;
            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + 30;

            const landedOnEnemy =
                y + CHARACTER_HEIGHT <= enemyTop + 5 &&
                y + CHARACTER_HEIGHT >= enemyTop &&
                velocity.y > 0 &&
                x + CHARACTER_WIDTH > enemyLeft &&
                x < enemyRight;

            const touchedEnemySide =
                x + CHARACTER_WIDTH > enemyLeft &&
                x < enemyRight &&
                y + CHARACTER_HEIGHT > enemyTop &&
                y < enemyBottom &&
                !landedOnEnemy;

            if (landedOnEnemy) {
                onEnemyCollision(enemy.id, true);
                return false;
            }

            if (touchedEnemySide) {
                onEnemyCollision(enemy.id, false);
                return true;
            }
        }
        return false;
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
        if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
        if (e.key === " " && jumpCount < (doubleJumpEnabled ? 2 : 1)) {
            setVelocity((v) => ({ ...v, y: -15 }));
            setIsJumping(true);
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
                    setIsJumping(false);
                    setJumpCount(0);
                } else if (newY >= GROUND_LEVEL) {
                    newY = GROUND_LEVEL;
                    setIsJumping(false);
                    setJumpCount(0);
                }

                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = GROUND_LEVEL + 50; // Fall on death
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
                animation: "bounce 0.5s infinite",
            }}
        />
    );
};

export default Character;
