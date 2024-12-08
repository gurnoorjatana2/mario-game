import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import { Howl } from "howler";
import Confetti from "react-confetti";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [enemies, setEnemies] = useState([
        { id: 1, x: 200, y: 270, isAlive: true, range: 100 },
        { id: 2, x: 500, y: 270, isAlive: true, range: 100 },
    ]);
    const [collectibles, setCollectibles] = useState([
        { id: 1, x: 120, y: 270, collected: false },
        { id: 2, x: 320, y: 170, collected: false },
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);

    const [canvasOffset, setCanvasOffset] = useState(0); // Offset for scrolling canvas
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    // Platforms
    const platforms = [
        { id: 1, x: 100, y: 300, width: 100, height: 20 },
        { id: 2, x: 300, y: 200, width: 100, height: 20 },
        { id: 3, x: 0, y: 380, width: 1600, height: 20 }, // Ground spans the entire level
    ];

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
            setScore((prev) => prev + 10);
        } else {
            setIsCharacterAlive(false);
        }
    };

    // Check win condition
    useEffect(() => {
        const allEnemiesDefeated = enemies.every((enemy) => !enemy.isAlive);
        const allCollectiblesCollected = collectibles.every((collectible) => collectible.collected);

        if (allEnemiesDefeated && allCollectiblesCollected) {
            setGameWon(true);
        }
    }, [enemies, collectibles]);

    // Background music
    useEffect(() => {
        const backgroundMusic = new Howl({
            src: ["../assets/background-music.mp3"],
            loop: true,
            volume: 0.5,
        });

        backgroundMusic.play();

        return () => backgroundMusic.stop();
    }, []);

    // Scroll canvas dynamically based on character's position
    useEffect(() => {
        if (playerPosition.x > CANVAS_WIDTH / 2) {
            setCanvasOffset(playerPosition.x - CANVAS_WIDTH / 2);
        }
    }, [playerPosition]);

    // Restart Game
    const restartGame = () => {
        setScore(0);
        setPlayerPosition({ x: 50, y: 300 });
        setEnemies([
            { id: 1, x: 200, y: 270, isAlive: true, range: 100 },
            { id: 2, x: 500, y: 270, isAlive: true, range: 100 },
        ]);
        setCollectibles([
            { id: 1, x: 120, y: 270, collected: false },
            { id: 2, x: 320, y: 170, collected: false },
        ]);
        setIsCharacterAlive(true);
        setGameWon(false);
        setCanvasOffset(0); // Reset canvas offset
    };

    return (
        <div
            style={{
                position: "relative",
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                overflow: "hidden",
                border: "2px solid black",
                background: "url(/assets/background.png) repeat-x", // Continuous background
                backgroundSize: "cover",
                transform: `translateX(-${canvasOffset}px)`, // Apply canvas scrolling
                transition: "transform 0.1s linear",
            }}
        >
            {/* Display Score */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: `${canvasOffset + 10}px`, // Adjust based on canvas offset
                    fontSize: "20px",
                    color: "white",
                }}
            >
                Score: {score}
            </div>

            {/* Render Platforms */}
            {platforms.map((platform) => (
                <Platform
                    key={platform.id}
                    x={platform.x - canvasOffset}
                    y={platform.y}
                    width={platform.width}
                    height={platform.height}
                    color={platform.id === 3 ? "gray" : "brown"}
                />
            ))}

            {/* Render Collectibles */}
            {collectibles.map(
                (collectible) =>
                    !collectible.collected && (
                        <Collectible
                            key={collectible.id}
                            x={collectible.x - canvasOffset}
                            y={collectible.y}
                            playerPosition={playerPosition}
                            onCollect={() => handleCollect(collectible.id)}
                        />
                    )
            )}

            {/* Render Enemies */}
            {enemies.map(
                (enemy) =>
                    enemy.isAlive && (
                        <Enemy
                            key={enemy.id}
                            enemy={{
                                ...enemy,
                                x: enemy.x - canvasOffset, // Adjust enemy position for scrolling
                            }}
                            playerPosition={playerPosition}
                            onEnemyCollision={handleEnemyCollision}
                        />
                    )
            )}

            {/* Render Character */}
            {isCharacterAlive && !gameWon && (
                <Character
                    onPositionUpdate={setPlayerPosition}
                    platforms={platforms.map((platform) => ({
                        ...platform,
                        x: platform.x - canvasOffset, // Adjust platform position for scrolling
                    }))}
                    enemies={enemies}
                    onEnemyCollision={handleEnemyCollision}
                />
            )}

            {/* Game Over Screen */}
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
                    <br />
                    Score: {score}
                    <button
                        onClick={restartGame}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Restart
                    </button>
                </div>
            )}

            {/* Victory Screen */}
            {gameWon && (
                <>
                    <Confetti width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
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
                        🎉 You Won! 🎉
                        <br />
                        Final Score: {score}
                        <button
                            onClick={restartGame}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            Play Again
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default GameCanvas;

