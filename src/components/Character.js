import React, { useState, useEffect } from "react";
import { Howl } from "howler";
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
    const [jumpCount, setJumpCount] = useState(0); // For double-jump tracking
    const [isInAir, setIsInAir] = useState(false); // Track airborne state

    const CHARACTER_HEIGHT = 50;
    const CHARACTER_WIDTH = 30;
    const GROUND_LEVEL = 380;
    const JUMP_HEIGHT = -12; // Adjust jump height for balanced gameplay

    // Sound Effects
    const jumpSound = new Howl({ src: ["/assets/jump.mp3"], volume: 0.8 });
    const landSound = new Howl({ src: ["/assets/land.mp3"], volume: 0.8 });

    // Check collision with platforms
    const checkCollisionWithPlatforms = (x, y) => {
        for (const platform of platforms) {
            const isColliding =
                x + CHARACTER_WIDTH > platform.x &&
                x < platform.x + platform.width &&
                y + CHARACTER_HEIGHT >= platform.y &&
                y + CHARACTER_HEIGHT <= platform.y + 10; // Buffer for collision

            if (isColliding) {
                return platform;
            }
        }
        return null;
    };

    // Check collision with enemies
    const checkCollisionWithEnemies = (x, y) => {
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;

            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + 30;
            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + 30;

            const landedOnTop =
                y + CHARACTER_HEIGHT <= enemyTop + 5 &&
                y + CHARACTER_HEIGHT >= enemyTop &&
                velocity.y > 0 &&
                x + CHARACTER_WIDTH > enemyLeft &&
                x < enemyRight;

            const touchedSideOrBottom =
                (y + CHARACTER_HEIGHT > enemyTop &&
                    y < enemyBottom &&
                    x + CHARACTER_WIDTH > enemyLeft &&
                    x < enemyRight) &&
                !landedOnTop;

            if (landedOnTop) {
                onEnemyCollision(enemy.id, true); // Enemy defeated
                return false;
            }

            if (touchedSideOrBottom) {
                onEnemyCollision(enemy.id, false); // Player defeated
                return true;
            }
        }
        return false;
    };

    // Handle player input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && jumpCount < (doubleJumpEnabled ? 2 : 1)) {
                jumpSound.play();
                setVelocity((v) => ({ ...v, y: JUMP_HEIGHT }));
                setJumpCount((count) => count + 1);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                setVelocity((v) => ({ ...v, x: 0 }));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [jumpCount, doubleJumpEnabled]);

    // Main game loop
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prevPosition) => {
                let newX = prevPosition.x + velocity.x;
                let newY = prevPosition.y + velocity.y;

                // Collision detection with platforms
                const platform = checkCollisionWithPlatforms(newX, newY);
                if (platform && velocity.y >= 0) {
                    newY = platform.y - CHARACTER_HEIGHT;
                    setJumpCount(0);
                    setIsInAir(false);
                    if (isInAir) landSound.play(); // Play landing sound
                } else if (newY >= GROUND_LEVEL) {
                    newY = GROUND_LEVEL;
                    setJumpCount(0);
                    setIsInAir(false);
                    if (isInAir) landSound.play(); // Play landing sound
                } else {
                    setIsInAir(true);
                }

                // Collision detection with enemies
                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = GROUND_LEVEL + 50; // Simulate fall on death
                }

                // Notify parent about position update
                const updatedPosition = { x: newX, y: newY };
                onPositionUpdate(updatedPosition);
                return updatedPosition;
            });

            // Apply gravity
            setVelocity((v) => ({
                x: v.x,
                y: Math.min(v.y + 1, 10), // Gravity and terminal velocity
            }));
        }, 1000 / 60); // 60 FPS

        return () => clearInterval(interval);
    }, [velocity, platforms, enemies, onEnemyCollision, onPositionUpdate, isInAir]);

    return (
        <img
            src={char}
            alt="Character"
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${CHARACTER_WIDTH}px`,
                height: `${CHARACTER_HEIGHT}px`,
                transition: "0.1s linear",
            }}
        />
    );
};

export default Character;
