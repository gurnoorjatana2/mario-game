import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import Flag from "./Flag";
import { Howl } from "howler";
import Confetti from "react-confetti";
import { level1 } from "../levels/level1";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(2);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [worldOffset, setWorldOffset] = useState(0);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const [collectibles, setCollectibles] = useState(level1.collectibles);
    const [enemies, setEnemies] = useState(level1.enemies);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    // Sound Effects
    const coinSound = new Howl({ src: ["/assets/coin.mp3"], volume: 0.8 });
    const backgroundMusic = new Howl({
        src: ["/assets/background-music.mp3"],
        loop: true,
        volume: 0.5,
    });

    // Reset Game
    const resetGame = () => {
        setScore(0);
        setLives(2);
        setIsCharacterAlive(true);
        setPlayerPosition({ x: 50, y: 300 });
        setWorldOffset(0);
        setCollectibles(level1.collectibles);
        setEnemies(level1.enemies);
        setGameWon(false);
    };

    // Restart Level
    const restartLevel = () => {
        setPlayerPosition({ x: 50, y: 300 });
        setWorldOffset(0);
        setCollectibles(level1.collectibles);
        setEnemies(level1.enemies);
    };

    // Handle Collectibles
    const handleCollect = (collectibleId, type) => {
        setCollectibles((prev) =>
            prev.map((collectible) =>
                collectible.id === collectibleId
                    ? { ...collectible, collected: true }
                    : collectible
            )
        );

        if (type === "score") {
            setScore((prev) => prev + 5);
            coinSound.play();
        }
    };

    // Handle Enemy Collision
    const handleEnemyCollision = () => {
        setLives((prev) => prev - 1);
        if (lives > 1) {
            restartLevel();
        } else {
            setIsCharacterAlive(false);
        }
    };

    // Handle Falling into Void
    const handleVoidCollision = () => {
        setLives((prev) => prev - 1);
        if (lives > 1) {
            restartLevel();
        } else {
            setIsCharacterAlive(false);
        }
    };

    // Handle Flag Collision
    const handleFlagCollision = () => {
        setGameWon(true);
    };

    // Update World Offset and Void Collision
    useEffect(() => {
        if (playerPosition.x > CANVAS_WIDTH / 2) {
            setWorldOffset(playerPosition.x - CANVAS_WIDTH / 2);
        }

        if (playerPosition.y > CANVAS_HEIGHT) {
            handleVoidCollision();
        }
    }, [playerPosition]);

    // Play Background Music
    useEffect(() => {
        backgroundMusic.play();
        return () => backgroundMusic.stop();
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                overflow: "hidden",
                border: "5px solid #444",
                background: "linear-gradient(to bottom, #87CEEB, #4CAF50)",
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

            {/* Restart Button */}
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <button
                    onClick={resetGame}
                    style={{
                        padding: "10px",
                        border: "none",
                        backgroundColor: "#ff4757",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Restart
                </button>
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
                {level1.platforms.map((platform) => (
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
                {enemies.map((enemy) => (
                    <Enemy
                        key={enemy.id}
                        enemy={enemy}
                        playerPosition={playerPosition}
                        onEnemyCollision={handleEnemyCollision}
                    />
                ))}

                {/* Flag */}
                <Flag
                    x={level1.flag.x}
                    y={level1.flag.y}
                    width={level1.flag.width}
                    height={level1.flag.height}
                    onCollision={handleFlagCollision}
                />

                {/* Character */}
                {isCharacterAlive && !gameWon && (
                    <Character
                        onPositionUpdate={setPlayerPosition}
                        platforms={level1.platforms}
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
                        🎉 Level Complete! 🎉
                    </div>
                </>
            )}
        </div>
    );
};

export default GameCanvas;
