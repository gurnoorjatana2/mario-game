import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import turbanGuy from "../assets/char.png"; // Ensure the image exists in this path

const Character = ({ onPositionUpdate, platforms, enemies, onEnemyCollision }) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState(null);

    const jumpSound = new Howl({
        src: ["/assets/jump.mp3"],
    });

    // Function to check collision with platforms
    const checkCollisionWithPlatforms = (x, y) => {
        for (const platform of platforms) {
            const isColliding =
                x + 30 > platform.x && // Character's right edge > Platform's left edge
                x < platform.x + platform.width && // Character's left edge < Platform's right edge
                y + 50 >= platform.y && // Character's bottom edge >= Platform's top edge
                y + 50 <= platform.y + 10; // Allow for slight height variation

            if (isColliding) {
                return platform; // Return the platform object
            }
        }
        return null;
    };

    // Function to check collision with enemies
    const checkCollisionWithEnemies = (x, y) => {
        for (const enemy of enemies) {
            if (!enemy.isAlive) continue;

            const isColliding =
                x + 30 > enemy.x &&
                x < enemy.x + 30 &&
                y + 50 > enemy.y &&
                y < enemy.y + 30;

            const wasJumpedOn = y + 50 >= enemy.y && y < enemy.y;

            if (isColliding) {
                onEnemyCollision(enemy.id, wasJumpedOn);
                return !wasJumpedOn; // Return true if character dies, false if enemy dies
            }
        }
        return false;
    };

    // Add event listeners for movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && !isJumping) {
                jumpSound.play();
                setVelocity((v) => ({ ...v, y: -18 })); // Higher jump
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

                // Check for platform collision
                const platform = checkCollisionWithPlatforms(newX, newY);
                if (platform && velocity.y >= 0) {
                    newY = platform.y - 50; // Align character's bottom with platform's top
                    setIsJumping(false);
                    setCurrentPlatform(platform);
                } else if (newY >= 380) {
                    newY = 380; // Ground level
                    setIsJumping(false);
                    setCurrentPlatform(null);
                } else {
                    setCurrentPlatform(null);
                }

                // Check if character leaves the platform
                if (
                    currentPlatform &&
                    (newX < currentPlatform.x || newX > currentPlatform.x + currentPlatform.width - 30)
                ) {
                    setCurrentPlatform(null);
                }

                // Check for enemy collision
                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = 400; // Character "falls" when dying
                    setIsJumping(false);
                }

                const updatedPosition = { x: newX, y: newY };
                onPositionUpdate(updatedPosition); // Notify parent of position update
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
        <img
            src={turbanGuy}
            alt="Character"
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "50px",
                transition: "0.1s linear",
            }}
        />
    );
};

export default Character;

