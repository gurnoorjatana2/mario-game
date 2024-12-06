import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import char from "../assets/char.png";

const Character = ({
    onPositionUpdate,
    platforms,
    enemies,
    onEnemyCollision,
    onCollectibleCollision,
}) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState(null);

    const CHARACTER_HEIGHT = 50;
    const CHARACTER_WIDTH = 30;
    const GROUND_LEVEL = 380;

    const [wasInAir, setWasInAir] = useState(false);

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

    // Collision with platforms
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

    // Collision with enemies
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
                onEnemyCollision(enemy.id, true); // Enemy is killed
                return false;
            }

            if (touchedSideOrBottom) {
                onEnemyCollision(enemy.id, false); // Character dies
                return true;
            }
        }
        return false;
    };

    // Collision with collectibles
    const checkCollisionWithCollectibles = (x, y) => {
        onCollectibleCollision?.(x, y, () => {
            coinSound.play();
        });
    };

    // Handle movement keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && !isJumping) {
                jumpSound.play();
                setVelocity((v) => ({ ...v, y: -15 }));
                setIsJumping(true);
                setCurrentPlatform(null);
                setWasInAir(true);
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

                // Platform collision
                const platform = checkCollisionWithPlatforms(newX, newY);
                if (platform && velocity.y >= 0) {
                    newY = platform.y - CHARACTER_HEIGHT;
                    setIsJumping(false);
                    setCurrentPlatform(platform);
                    if (wasInAir) {
                        landSound.play();
                        setWasInAir(false);
                    }
                } else if (newY >= GROUND_LEVEL) {
                    newY = GROUND_LEVEL;
                    setIsJumping(false);
                    setCurrentPlatform(null);
                    if (wasInAir) {
                        landSound.play();
                        setWasInAir(false);
                    }
                } else {
                    setCurrentPlatform(null);
                    setWasInAir(true);
                }

                // Enemy collision
                const died = checkCollisionWithEnemies(newX, newY);
                if (died) {
                    newY = GROUND_LEVEL + 50;
                    setIsJumping(false);
                }

                // Collectible collision
                checkCollisionWithCollectibles(newX, newY);

                const updatedPosition = { x: newX, y: newY };
                requestAnimationFrame(() => onPositionUpdate(updatedPosition));
                return updatedPosition;
            });

            // Gravity
            setVelocity((v) => ({
                x: v.x,
                y: Math.min(v.y + 1, 10),
            }));
        }, 20);

        return () => clearInterval(interval);
    }, [velocity, platforms, currentPlatform, enemies, onEnemyCollision, onPositionUpdate, wasInAir]);

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
