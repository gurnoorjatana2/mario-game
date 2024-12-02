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

    const FRAME_HEIGHT = 400; // Height of the game canvas
    const MAX_JUMP_HEIGHT = -20; // Maximum jump velocity
    const GRAVITY = 1; // Gravity applied to the character

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
            if (e.key === " " && velocity.y > MAX_JUMP_HEIGHT) {
                jumpSound.play();
                setVelocity((v) => ({
                    ...v,
                    y: v.y + -5, // Add upward velocity on each press
                }));
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
    }, [velocity.y]);

    // Main game loop
    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prevPos) => {
                let newX = prevPos.x + velocity.x;
                let newY = prevPos.y + velocity.y;

                // Apply ceiling limit
                if (newY < 0) {
                    newY = 0; // Prevent leaving the top of the frame
                    setVelocity((v) => ({ ...v, y: 0 })); // Reset upward velocity
                }

                // Check platform collision
                const platform = checkCollisionWithPlatforms(newX, newY);
                if (platform && newY + 30 >= platform.y && velocity.y >= 0) {
                    newY = platform.y - 30; // Land on platform
                    setIsJumping(false);
                    setCurrentPlatform(platform);
                } else if (newY >= FRAME_HEIGHT - 30) {
                    // Ground level
                    newY = FRAME_HEIGHT - 30;
                    setIsJumping(false);
                    setCurrentPlatform(null);
                } else {
                    setCurrentPlatform(null);
                }

                // Apply gravity
                if (!platform && newY < FRAME_HEIGHT - 30) {
                    setVelocity((v) => ({ ...v, y: v.y + GRAVITY }));
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
                    newY = FRAME_HEIGHT; // Character "falls" when dying
                    setIsJumping(false);
                }

                return { x: newX, y: newY };
            });
        }, 20);

        return () => clearInterval(interval);
    }, [velocity, platforms, currentPlatform, enemies, onEnemyCollision]);

    // Notify parent of position update
    useEffect(() => {
        onPositionUpdate(position);
    }, [position, onPositionUpdate]);

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



