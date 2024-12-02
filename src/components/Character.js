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
                x + 30 > platform.x && // Character's right edge > platform's left edge
                x < platform.x + platform.width && // Character's left edge < platform's right edge
                y + 30 >= platform.y && // Character's bottom edge >= platform's top edge
                y + 30 <= platform.y + platform.height; // Character's bottom edge <= platform's bottom edge

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
                x + 30 > enemy.x && // Character's right edge > enemy's left edge
                x < enemy.x + 30 && // Character's left edge < enemy's right edge
                y + 30 > enemy.y && // Character's bottom edge > enemy's top edge
                y < enemy.y + 30; // Character's top edge < enemy's bottom edge

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
            setPosition((prevPos) => {
                let newX = prevPos.x + velocity.x;
                let newY = prevPos.y + velocity.y;

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

