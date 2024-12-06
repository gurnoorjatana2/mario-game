import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import { Howl } from "howler";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [platforms, setPlatforms] = useState([
        { id: 1, x: 0, y: 380, width: 800, height: 20 }, // Ground
        { id: 2, x: 300, y: 300, width: 100, height: 20 },
        { id: 3, x: 600, y: 200, width: 100, height: 20 },
    ]);
    const [enemies, setEnemies] = useState([
        { id: 1, x: 500, y: 270, isAlive: true },
        { id: 2, x: 700, y: 170, isAlive: true },
    ]);
    const [collectibles, setCollectibles] = useState([
        { id: 1, x: 400, y: 270, collected: false },
        { id: 2, x: 650, y: 170, collected: false },
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const finishLine = 800; // Position of the finish line
    const [cameraOffset, setCameraOffset] = useState(0); // Camera position

    // Background music setup
    useEffect(() => {
        const backgroundMusic = new Howl({
            src: ["/assets/background-music.mp3"],
            loop: true,
            volume: 0.5,
        });

        backgroundMusic.play();
        return () => backgroundMusic.stop();
    }, []);

    // Adjust camera position
    useEffect(() => {
        const visibleWidth = 800; // Viewport width
        const scrollThreshold = 400; // Where scrolling starts

        if (playerPosition.x > cameraOffset + scrollThreshold) {
            setCameraOffset(playerPosition.x - scrollThreshold);
        } else if (playerPosition.x < cameraOffset + 100) {
            setCameraOffset(Math.max(0, playerPosition.x - 100));
        }
    }, [playerPosition.x, cameraOffset]);

    // Handle collectible collection
    const handleCollect = (collectibleId) => {
        setCollectibles((prev) =>
            prev.map((collectible) =>
                collectible.id === collectibleId ? { ...collectible, collected: true } : collectible
            )
        );
        setScore((prev) => prev + 5);
    };

    // Handle enemy collision
    const handleEnemyCollision = (enemyId, wasJumpedOn) => {
        if (wasJumpedOn) {
            setEnemies((prev) =>
                prev.map((enemy) =>
                    enemy.id === enemyId ? { ...enemy, isAlive: false } : enemy
                )
            );
            setScore((prev) => prev + 10); // Bonus for defeating an enemy
        } else {
            setIsCharacterAlive(false); // Character dies
        }
    };

    // Check if game is won
    useEffect(() => {
        const allEnemiesDefeated = enemies.every((enemy) => !enemy.isAlive);
        const allCollectiblesCollected = collectibles.every((collectible) => collectible.collected);

        if (allEnemiesDefeated && allCollectiblesCollected && playerPosition.x > finishLine) {
            setGameWon(true);
        }
    }, [enemies, collectibles, playerPosition.x]);

    return (
        <div
            style={{
                position: "relative",
                width: "800px",
                height: "400px",
                overflow: "hidden",
                border: "2px solid black",
                background: "url(/assets/background.png) no-repeat center",
                backgroundSize: "cover",
            }}
        >
            {/* Display Score */}
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
            </div>

            {/* Render game elements with camera offset */}
            <div
                style={{
                    position: "absolute",
                    left: `-${cameraOffset}px`,
                    width: "1200px", // Game world width
                    height: "400px",
                }}
            >
                {/* Render platforms */}
                {platforms.map((platform) => (
                    <Platform
                        key={platform.id}
                        x={platform.x}
                        y={platform.y}
                        width={platform.width}
                        height={platform.height}
                        color="brown"
                    />
                ))}

                {/* Render collectibles */}
                {collectibles.map(
                    (collectible) =>
                        !collectible.collected && (
                            <Collectible
                                key={collectible.id}
                                x={collectible.x}
                                y={collectible.y}
                                playerPosition={playerPosition}
                                onCollect={() => handleCollect(collectible.id)}
                            />
                        )
                )}

                {/* Render enemies */}
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

                {/* Render finish line */}
                <div
                    style={{
                        position: "absolute",
                        left: `${finishLine}px`,
                        top: "330px",
                        width: "20px",
                        height: "50px",
                        backgroundColor: "red",
                    }}
                ></div>

                {/* Render character */}
                {isCharacterAlive && (
                    <Character
                        onPositionUpdate={setPlayerPosition}
                        platforms={platforms}
                        enemies={enemies}
                        onEnemyCollision={handleEnemyCollision}
                    />
                )}
            </div>

            {/* Game Over Screen */}
            {!isCharacterAlive && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "30px",
                        color: "yellow",
                        textAlign: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    Game Over! Try Again!
                </div>
            )}

            {/* You Won Screen */}
            {gameWon && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "30px",
                        color: "yellow",
                        textAlign: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    🎉 Congratulations! You Won! 🎉
                </div>
            )}
        </div>
    );
};

export default GameCanvas;










