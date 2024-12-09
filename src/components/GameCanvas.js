import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import Flag from "./Flag";
import { Howl } from "howler";
import { level1 } from "../levels/level1";
import { level2 } from "../levels/level2";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [worldOffset, setWorldOffset] = useState(0);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [currentLevel, setCurrentLevel] = useState(level1);
    const [doubleJumpEnabled, setDoubleJumpEnabled] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [countdown, setCountdown] = useState(null);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    const [enemies, setEnemies] = useState(currentLevel.enemies);
    const [collectibles, setCollectibles] = useState(currentLevel.collectibles);

    // Sound Effects
    const coinSound = new Howl({ src: ["/assets/coin.mp3"], volume: 0.8 });
    const powerUpSound = new Howl({ src: ["/assets/power-up.mp3"], volume: 0.8 });
    const backgroundMusic = new Howl({
        src: ["/assets/background-music.mp3"],
        loop: true,
        volume: 0.5,
    });

    // Handle collectible collection
    const handleCollect = (collectibleId, type) => {
        setCollectibles((prev) =>
            prev.map((collectible) =>
                collectible.id === collectibleId ? { ...collectible, collected: true } : collectible
            )
        );

        if (type === "score") {
            setScore((prev) => prev + 5);
            coinSound.play();
        } else if (type === "doubleJump") {
            setDoubleJumpEnabled(true);
            powerUpSound.play();
        }
    };

    // Handle enemy collision
    const handleEnemyCollision = (enemyId, wasJumpedOn) => {
        if (wasJumpedOn) {
            setEnemies((prev) =>
                prev.map((enemy) =>
                    enemy.id === enemyId ? { ...enemy, isAlive: false } : enemy
                )
            );
            setScore((prev) => prev + 10);
        } else {
            setLives((prev) => prev - 1);
            if (lives > 1) {
                restartLevel();
            } else {
                setIsCharacterAlive(false);
            }
        }
    };

    // Restart the level
    const restartLevel = () => {
        setPlayerPosition({ x: 50, y: 300 });
        setWorldOffset(0);
        setDoubleJumpEnabled(false);
        setEnemies(currentLevel.enemies);
        setCollectibles(currentLevel.collectibles);
    };

    // Restart the game
    const restartGame = () => {
        setScore(0);
        setLives(3);
        setGameWon(false);
        setCurrentLevel(level1);
        restartLevel();
    };

    // Handle flag collision
    const handleFlagCollision = (x, y) => {
        const flag = currentLevel.flag;
        const isAtFlag =
            x + 30 > flag.x &&
            x < flag.x + flag.width &&
            y + 50 > flag.y &&
            y < flag.y + flag.height;

        if (isAtFlag) {
            setGameWon(true);
            setCountdown(5);
        }
    };

    // Automatic level transition with countdown
    useEffect(() => {
        if (gameWon && countdown !== null) {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        if (currentLevel === level1) {
                            setCurrentLevel(level2);
                            setEnemies(level2.enemies);
                            setCollectibles(level2.collectibles);
                            restartLevel();
                        } else {
                            setGameWon(false);
                        }
                        clearInterval(interval);
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [gameWon, countdown]);

    // Play background music
    useEffect(() => {
        backgroundMusic.play();
        return () => backgroundMusic.stop();
    }, []);

    // Update world offset
    useEffect(() => {
        if (playerPosition.x > CANVAS_WIDTH / 2) {
            setWorldOffset(playerPosition.x - CANVAS_WIDTH / 2);
        }
    }, [playerPosition]);

    return (
        <div
            style={{
                position: "relative",
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                overflow: "hidden",
                border: "5px solid #444",
                background: "linear-gradient(to bottom, #87CEEB, #4CAF50)",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* HUD: Score and Lives */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    fontSize: "20px",
                    color: "white",
                }}
            >
                Score: {score}
                <div>Lives: {"❤️".repeat(lives)}</div>
            </div>

            <div
                style={{
                    position: "relative",
                    width: "8000px",
                    height: `${CANVAS_HEIGHT}px`,
                    transform: `translateX(-${worldOffset}px)`,
                }}
            >
                {/* Platforms */}
                {currentLevel.platforms.map((platform) => (
                    <Platform
                        key={platform.id}
                        x={platform.x}
                        y={platform.y}
                        width={platform.width}
                        height={platform.height}
                        color={platform.color}
                    />
                ))}

                {/* Collectibles */}
                {collectibles.map(
                    (collectible) =>
                        !collectible.collected && (
                            <Collectible
                                key={collectible.id}
                                x={collectible.x}
                                y={collectible.y}
                                playerPosition={playerPosition}
                                onCollect={() =>
                                    handleCollect(collectible.id, collectible.type)
                                }
                            />
                        )
                )}

                {/* Enemies */}
                {enemies.map(
                    (enemy) =>
                        enemy.isAlive && (
                            <Enemy
                                key={enemy.id}
                                enemy={enemy}
                                playerPosition={playerPosition}
                                onEnemyCollision={handleEnemyCollision}
                            />
                        )
                )}

                {/* Flag */}
                <Flag x={currentLevel.flag.x} y={currentLevel.flag.y} />

                {/* Character */}
                {isCharacterAlive && !gameWon && (
                    <Character
                        onPositionUpdate={(pos) => {
                            setPlayerPosition(pos);
                            handleFlagCollision(pos.x, pos.y);
                        }}
                        platforms={currentLevel.platforms}
                        enemies={enemies}
                        doubleJumpEnabled={doubleJumpEnabled}
                        onEnemyCollision={handleEnemyCollision}
                    />
                )}
            </div>

            {/* Game Over */}
            {!isCharacterAlive && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "30px",
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    Game Over
                </div>
            )}

            {/* Victory / Countdown */}
            {gameWon && countdown !== null && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "30px",
                        color: "yellow",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    🎉 Level Complete! 🎉
                    <br />
                    Next Level in {countdown} seconds
                </div>
            )}
        </div>
    );
};

export default GameCanvas;
