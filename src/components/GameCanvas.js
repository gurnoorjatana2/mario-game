import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import { Howl } from "howler";

const GameCanvas = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [enemies, setEnemies] = useState([]);
    const [collectibles, setCollectibles] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);

    // Define level data
    const levelData = {
        1: {
            platforms: [
                { id: 1, x: 100, y: 300, width: 100, height: 20 },
                { id: 2, x: 300, y: 200, width: 100, height: 20 },
                { id: 3, x: 0, y: 380, width: 800, height: 20 }, // Ground
            ],
            enemies: [
                { id: 1, x: 200, y: 270, isAlive: true, range: 100 },
                { id: 2, x: 500, y: 270, isAlive: true, range: 100 },
            ],
            collectibles: [
                { id: 1, x: 120, y: 270, collected: false },
                { id: 2, x: 320, y: 170, collected: false },
            ],
        },
        2: {
            platforms: [
                { id: 1, x: 50, y: 300, width: 100, height: 20 },
                { id: 2, x: 200, y: 250, width: 100, height: 20 },
                { id: 3, x: 350, y: 200, width: 100, height: 20 },
                { id: 4, x: 0, y: 380, width: 800, height: 20 }, // Ground
            ],
            enemies: [
                { id: 1, x: 100, y: 270, isAlive: true, range: 150 },
                { id: 2, x: 300, y: 250, isAlive: true, range: 200 },
                { id: 3, x: 600, y: 250, isAlive: true, range: 100 },
            ],
            collectibles: [
                { id: 1, x: 70, y: 270, collected: false },
                { id: 2, x: 250, y: 220, collected: false },
                { id: 3, x: 400, y: 170, collected: false },
            ],
        },
    };

    // Load level data
    const loadLevel = (level) => {
        if (levelData[level]) {
            const { platforms, enemies, collectibles } = levelData[level];
            setPlatforms(platforms || []);
            setEnemies(enemies || []);
            setCollectibles(collectibles || []);
            setPlayerPosition({ x: 50, y: 300 }); // Reset character position
            setIsCharacterAlive(true);
            setGameWon(false);
        } else {
            console.error(`Level ${level} is not defined in levelData.`);
            setGameWon(true); // End game if no more levels
        }
    };

    useEffect(() => {
        loadLevel(level);
    }, [level]);

    // Handle collectible collection
    const handleCollect = (collectibleId) => {
        setCollectibles((prev) =>
            prev.map((collectible) =>
                collectible.id === collectibleId ? { ...collectible, collected: true } : collectible
            )
        );
        setScore((prev) => prev + 5); // Add 5 points per collectible
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
            setIsCharacterAlive(false);
        }
    };

    // Check win condition
    useEffect(() => {
        const allEnemiesDefeated = enemies.every((enemy) => !enemy.isAlive);
        const allCollectiblesCollected = collectibles.every((collectible) => collectible.collected);

        if (allEnemiesDefeated && allCollectiblesCollected) {
            if (level < Object.keys(levelData).length) {
                setLevel((prev) => prev + 1); // Move to the next level
            } else {
                setGameWon(true); // Game completed
            }
        }
    }, [enemies, collectibles, level]);

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
            {/* Display the score and level */}
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
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "20px",
                    color: "white",
                }}
            >
                Level: {level}
            </div>

            {/* Restart Level Button */}
            <button
                onClick={() => loadLevel(level)}
                style={{
                    position: "absolute",
                    top: "50px",
                    left: "10px",
                    padding: "10px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Restart Level
            </button>

            {/* Render platforms */}
            {platforms.map((platform) => (
                <Platform key={platform.id} {...platform} color={platform.id === 3 ? "gray" : "brown"} />
            ))}

            {/* Render collectibles */}
            {collectibles.map(
                (collectible) =>
                    !collectible.collected && (
                        <Collectible
                            key={collectible.id}
                            {...collectible}
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

            {/* Render character if alive */}
            {isCharacterAlive && !gameWon && (
                <Character
                    onPositionUpdate={setPlayerPosition}
                    platforms={platforms}
                    enemies={enemies}
                    onEnemyCollision={handleEnemyCollision}
                />
            )}

            {/* Show "You Won" screen */}
            {gameWon && (
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
                    🎉 Congratulations! You've completed all levels! 🎉
                    <br />
                    Final Score: {score}
                </div>
            )}
        </div>
    );
};

export default GameCanvas;


