import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import { Howl } from "howler";
import Confetti from "react-confetti";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [worldOffset, setWorldOffset] = useState(0);
    const [platforms, setPlatforms] = useState([
        { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" }, // Floor
        { id: 2, x: 200, y: 300, width: 150, height: 20, color: "brown" }, // Elevated platform
        { id: 3, x: 600, y: 250, width: 100, height: 20, color: "green" }, // Higher platform
    ]);
    const [enemies, setEnemies] = useState([
        { id: 1, x: 400, y: 350, isAlive: true },
        { id: 2, x: 700, y: 350, isAlive: true },
    ]);
    const [collectibles, setCollectibles] = useState([
        { id: 1, x: 500, y: 300, collected: false, type: "doubleJump" },
        { id: 2, x: 800, y: 200, collected: false, type: "score" },
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const [paused, setPaused] = useState(false);
    const [doubleJumpEnabled, setDoubleJumpEnabled] = useState(false);
    const [level, setLevel] = useState(1);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    // Handle collectible collection
    const handleCollect = (collectibleId, type) => {
        setCollectibles((prev) =>
            prev.map((collectible) =>
                collectible.id === collectibleId ? { ...collectible, collected: true } : collectible
            )
        );
        if (type === "score") {
            setScore((prev) => prev + 5);
        } else if (type === "doubleJump") {
            setDoubleJumpEnabled(true);
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
            setLives((prevLives) => prevLives - 1);
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
        setEnemies([
            { id: 1, x: 400, y: 350, isAlive: true },
            { id: 2, x: 700, y: 350, isAlive: true },
        ]);
        setCollectibles([
            { id: 1, x: 500, y: 300, collected: false, type: "doubleJump" },
            { id: 2, x: 800, y: 200, collected: false, type: "score" },
        ]);
        setPlatforms([
            { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" },
            { id: 2, x: 200, y: 300, width: 150, height: 20, color: "brown" },
            { id: 3, x: 600, y: 250, width: 100, height: 20, color: "green" },
        ]);
    };

    // Restart the game
    const restartGame = () => {
        setScore(0);
        setLives(3);
        setLevel(1);
        setGameWon(false);
        restartLevel();
    };

    // Pause the game
    const togglePause = () => {
        setPaused((prev) => !prev);
    };

    // Progress to the next level
    useEffect(() => {
        if (playerPosition.x > 1000 && level === 1) {
            setLevel(2);
            setPlayerPosition({ x: 50, y: 300 });
            setWorldOffset(0);
            setPlatforms([
                { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" },
                { id: 2, x: 300, y: 300, width: 150, height: 20, color: "brown" },
                { id: 3, x: 700, y: 250, width: 100, height: 20, color: "green" },
                { id: 4, x: 1000, y: 200, width: 200, height: 20, color: "brown" },
            ]);
            setCollectibles([
                { id: 1, x: 500, y: 300, collected: false, type: "doubleJump" },
                { id: 2, x: 900, y: 200, collected: false, type: "score" },
            ]);
        }
    }, [playerPosition.x, level]);

    return (
        <div
            style={{
                position: "relative",
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                overflow: "hidden",
                border: "2px solid black",
                background: "url(/assets/background.png) repeat-x",
                backgroundSize: "cover",
            }}
        >
            {/* Score and lives */}
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

            {/* Buttons */}
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <button onClick={restartGame} style={{ margin: "5px" }}>
                    Restart
                </button>
                <button onClick={togglePause} style={{ margin: "5px" }}>
                    {paused ? "Resume" : "Pause"}
                </button>
            </div>

            <div
                style={{
                    position: "relative",
                    width: "4000px",
                    height: `${CANVAS_HEIGHT}px`,
                    transform: `translateX(-${worldOffset}px)`,
                }}
            >
                {/* Platforms */}
                {platforms.map((platform) => (
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
                {/* Character */}
                {isCharacterAlive && !gameWon && (
                    <Character
                        onPositionUpdate={setPlayerPosition}
                        platforms={platforms}
                        enemies={enemies}
                        doubleJumpEnabled={doubleJumpEnabled}
                        onEnemyCollision={handleEnemyCollision}
                    />
                )}
            </div>
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
            {gameWon && (
                <Confetti width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            )}
        </div>
    );
};

export default GameCanvas;
