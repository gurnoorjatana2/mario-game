import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import char from "../assets/char.png";

const Character = ({ onPositionUpdate, platforms, enemies, onEnemyCollision, onCollectibleCollision }) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState(null);

    const CHARACTER_HEIGHT = 50;
    const CHARACTER_WIDTH = 30;
    const GROUND_LEVEL = 380;

    // Sound Effects
    const jumpSound = new Howl({
        src: ["/assets/jump.mp3"],
        volume: 0.8,
    });

    const landSound = new Howl({
        src: ["/assets/land.mp3"],
        volume: 0.8,
    });

    const coinSound = new Howl({
        src: ["/assets/coin.mp3"],
        volume: 0.8,
    });

    // Check collision with platforms
    const checkCollisionWithPlatforms = (x, y) => {
        for (const platform of platforms) {
            const isColliding =
                x + CHARACTER_WIDTH > platform.x &&
                x < platform.x + platform.width &&
                y + CHARACTER_HEIGHT >= platform.y &&
                y + CHARACTER_HEIGHT <= platform.y + 10;

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
                x + CHARACTER_WIDTH > enemy.x &&
                x < enemy.x + 30 &&
                y + CHARACTER_HEIGHT > enemy.y &&
                y < enemy.y + 30;

            const wasJumpedOn =
                y + CHARACTER_HEIGHT <= enemy.y + 5 && // Character is above enemy
                velocity.y > 0; // Character is falling

            if (isColliding) {
                onEnemyCollision(enemy.id, wasJumpedOn);
                return !wasJumpedOn; // Return true if character dies, false if enemy dies
            }
        }
        return false;
    };

    // Check collision with collectibles
    const checkCollisionWithCollectibles = (x, y) => {
        onCollectibleCollision?.(x, y, () => {
            coinSound.play(); // Play coin sound if a collectible is collected
        });
    };

    // Handle keydown events for movement and jumping
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && !isJumping) {
                jumpSound.play();
                setVelocity((v) => ({ ...v, y: -15 })); // Adjust jump height
                setIsJumping(true);
                setCurrentPlatform(null); // Exit platform when jumping
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft")
                setVelocity((v) => ({ ...v, x: 0 }));
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
                    newY = platform.y - CHARACTER_HEIGHT;
                    setIsJumping(false);
                    setCurrentPlatform(platform);
                    if (velocity.y > 0) landSound.play(); // Play landing sound
                } else if (newY >= GROUND_LEVEL) {
                    newY = GROUND_LEVEL; // Align with ground level
                    setIsJumping(false);
                    setCurrentPlatform(null);
                } else {
                    setCurrentPlatform(null);
                }

                // Check if character leaves the platform
                if (
                    currentPlatform &&
                    (newX < currentPlatform.x ||
                        newX > currentPlatform.x + currentPlatform.width - CHARACTER_WIDTH)
                ) {
                    setCurrentPlatform(null);
                }

                // Check for enemy collision
                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = GROUND_LEVEL + 50; // Character "falls" when dying
                    setIsJumping(false);
                }

                // Check for collectible collision
                checkCollisionWithCollectibles(newX, newY);

                const updatedPosition = { x: newX, y: newY };
                requestAnimationFrame(() => onPositionUpdate(updatedPosition));
                return updatedPosition;
            });

            // Apply gravity
            setVelocity((v) => ({
                x: v.x,
                y: Math.min(v.y + 1, 10), // Gravity and terminal velocity
            }));
        }, 20);

        return () => clearInterval(interval);
    }, [velocity, platforms, currentPlatform, enemies, onEnemyCollision, onPositionUpdate]);

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
