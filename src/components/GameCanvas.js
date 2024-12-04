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

    // Level data
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

    // Load the current level
    const loadLevel = (level) => {
        const levelInfo = levelData[level];
        if (levelInfo) {
            setPlatforms(levelInfo.platforms);
            setEnemies(levelInfo.enemies);
            setCollectibles(levelInfo.collectibles);
            setPlayerPosition({ x: 50, y: 300 }); // Reset player position
            setIsCharacterAlive(true);
            setGameWon(false);
        } else {
            setGameWon(true); // No more levels
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
        setScore((prev) => prev + 5); // Add points for collecting
    };

    // Handle enemy collision
    const handleEnemyCollision = (enemyId, wasJumpedOn) => {
        if (wasJumpedOn) {
            setEnemies((prev) =>
                prev.map((enemy) =>
                    enemy.id === enemyId ? { ...enemy, isAlive: false } : enemy
                )
            );
            setScore((prev) => prev + 10); // Add points for defeating enemies
        } else {
            setIsCharacterAlive(false); // Character dies
        }
    };

    // Check if the level is completed
    useEffect(() => {
        const allEnemiesDefeated = enemies.every((enemy) => !enemy.isAlive);
        const allCollectiblesCollected = collectibles.every((collectible) => collectible.collected);

        if (allEnemiesDefeated && allCollectiblesCollected) {
            setLevel((prev) => prev + 1); // Move to the next level
        }
    }, [enemies, collectibles]);

    // Background music
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
            {/* Display score and level */}
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

            {/* Display "You Won" if the game is completed */}
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
                    🎉 Congratulations! You've completed all levels! 🎉
                </div>
            )}
        </div>
    );
};

export default GameCanvas;





