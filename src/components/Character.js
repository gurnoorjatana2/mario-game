import React, { useState, useEffect } from "react";
import { Howl } from "howler";

const Character = ({ onPositionUpdate, platforms, enemies, onEnemyCollision }) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState(null);

    const jumpSound = new Howl({
        src: ["/assets/jump.mp3"],
    });

    // Check collision with platforms
    const checkCollisionWithPlatforms = (x, y) => {
        for (const platform of platforms) {
            const isColliding =
                x + 30 > platform.x &&
                x < platform.x + platform.width &&
                y + 30 >= platform.y &&
                y + 30 <= platform.y + platform.height;

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

            const isColliding =
                x + 30 > enemy.x &&
                x < enemy.x + 30 &&
                y + 30 > enemy.y &&
                y < enemy.y + 30;

            const wasJumpedOn = y + 30 >= enemy.y && y < enemy.y;

            if (isColliding) {
                onEnemyCollision(enemy.id, wasJumpedOn);
                return !wasJumpedOn; // Return true if character dies, false if enemy dies
            }
        }
        return false;
    };

    // Movement event listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && !isJumping) {
                jumpSound.play();
                setVelocity((v) => ({ ...v, y: -15 }));
                setIsJumping(true);
                setCurrentPlatform(null); // Exit platform when jumping
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: 0 }));
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isJumping]);

    // Main game loop
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((pos) => {
                let newX = pos.x + velocity.x;
                let newY = pos.y + velocity.y;

                // Check platform collision
                const platform = checkCollisionWithPlatforms(newX, newY);
                if (platform && newY + 30 >= platform.y && velocity.y >= 0) {
                    newY = platform.y - 30; // Land on platform
                    setIsJumping(false);
                    setCurrentPlatform(platform);
                } else if (newY >= 300) {
                    newY = 300; // Ground level
                    setIsJumping(false);
                    setCurrentPlatform(null);
                } else {
                    setCurrentPlatform(null);
                }

                // Restrict movement to platform boundaries
                if (currentPlatform) {
                    if (newX < currentPlatform.x || newX > currentPlatform.x + currentPlatform.width - 30) {
                        setCurrentPlatform(null);
                    }
                }

                // Check enemy collision
                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = 400; // Character "falls" when dying
                    setIsJumping(false);
                }

                const updatedPosition = { x: newX, y: newY };
                onPositionUpdate(updatedPosition);
                return updatedPosition;
            });

            // Apply gravity
            setVelocity((v) => ({
                x: v.x,
                y: v.y + 1, // Gravity
            }));
        }, 20);

        return () => clearInterval(interval);
    }, [velocity, platforms, currentPlatform, enemies, onEnemyCollision, onPositionUpdate]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "30px",
                backgroundColor: "red",
                borderRadius: "5px",
            }}
        ></div>
    );
};

export default Character;
