import React, { useState, useEffect } from "react";
import { Howl } from "howler";

const Character = ({ onPositionUpdate, platforms, enemies, onEnemyCollision }) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);

    const jumpSound = new Howl({
        src: ["/assets/jump.mp3"],
    });

    const checkCollisionWithPlatforms = (x, y) => {
        for (const platform of platforms) {
            const isColliding =
                x + 30 > platform.x && // Character's right edge > platform's left edge
                x < platform.x + platform.width && // Character's left edge < platform's right edge
                y + 30 >= platform.y && // Character's bottom edge >= platform's top edge
                y + 30 <= platform.y + 5; // Character's bottom edge is within platform height

            if (isColliding) {
                return platform.y - 30; // Return the adjusted Y position
            }
        }
        return null;
    };

    const checkCollisionWithEnemies = (x, y) => {
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;

            const isColliding =
                x + 30 > enemy.x && // Character's right edge > enemy's left edge
                x < enemy.x + 30 && // Character's left edge < enemy's right edge
                y + 30 > enemy.y && // Character's bottom edge > enemy's top edge
                y < enemy.y + 30; // Character's top edge < enemy's bottom edge

            const wasJumpedOn = y + 30 >= enemy.y && y < enemy.y; // Character lands on the enemy

            if (isColliding) {
                onEnemyCollision(enemy.id, wasJumpedOn); // Notify parent about the collision
                if (!wasJumpedOn) return true; // Character dies if not jumping on the enemy
            }
        }
        return false;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && !isJumping) {
                jumpSound.play();
                setVelocity((v) => ({ ...v, y: -15 }));
                setIsJumping(true);
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

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((pos) => {
                const newX = pos.x + velocity.x;
                let newY = pos.y + velocity.y;

                // Check collision with platforms
                const platformY = checkCollisionWithPlatforms(newX, newY);
                if (platformY !== null) {
                    newY = platformY;
                    setIsJumping(false);
                } else if (newY >= 300) {
                    newY = 300; // Ground level
                    setIsJumping(false);
                }

                // Check collision with enemies
                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = 400; // Character "falls" when dying
                    setIsJumping(false);
                }

                const updatedPosition = { x: newX, y: newY };
                requestAnimationFrame(() => onPositionUpdate(updatedPosition)); // Update parent state asynchronously
                return updatedPosition;
            });

            setVelocity((v) => ({
                x: v.x,
                y: v.y + 1, // Gravity
            }));
        }, 20);

        return () => clearInterval(interval);
    }, [velocity, platforms, enemies, onEnemyCollision, onPositionUpdate]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "30px",
                backgroundColor: "red",
            }}
        ></div>
    );
};

export default Character;
