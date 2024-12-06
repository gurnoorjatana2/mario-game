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

    // Platforms
    const platforms = [
        { id: 1, x: 100, y: 300, width: 100, height: 20 }, // Regular platform
        { id: 2, x: 300, y: 200, width: 100, height: 20 }, // Higher platform
        { id: 3, x: 0, y: 380, width: 800, height: 20 }, // Ground
    ];

    // Sounds
    const backgroundMusic = new Howl({
        src: ["../assets/background-music.mp3"],
        loop: true,
        volume: 0.5,
    });

    const collectSound = new Howl({
        src: ["../assets/coin.mp3"],
        volume: 0.8,
    });

    // Play Background Music
    useEffect(() => {
        backgroundMusic.play();
        return () => backgroundMusic.stop();
    }, []);

    // Handle collectible collision
    const handleCollectibleCollision = (x, y, playSoundCallback) => {
        setCollectibles((prevCollectibles) =>
            prevCollectibles.map((collectible) => {
                const isColliding =
                    !collectible.collected &&
                    x + 30 > collectible.x &&
                    x < collectible.x + 20 &&
                    y + 50 > collectible.y &&
                    y < collectible.y + 20;

                if (isColliding) {
                    playSoundCallback(); // Play collectible sound
                    return { ...collectible, collected: true };
                }
                return collectible;
            })
        );
        setScore((prevScore) => prevScore + 5); // Increase score by 5 for each collectible
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
    };

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

            {/* Render Platforms */}
            {platforms.map((platform) => (
                <Platform
                    key={platform.id}
                    x={platform.x}
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
                            x={collectible.x}
                            y={collectible.y}
                            playerPosition={playerPosition}
                            onCollect={() => handleCollectibleCollision(
                                playerPosition.x,
                                playerPosition.y,
                                () => collectSound.play()
                            )}
                        />
                    )
            )}

            {/* Render Enemies */}
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

            {/* Render Character */}
            {isCharacterAlive && !gameWon && (
                <Character
                    onPositionUpdate={setPlayerPosition}
                    platforms={platforms}
                    enemies={enemies}
                    onEnemyCollision={handleEnemyCollision}
                    onCollectibleCollision={(x, y) =>
                        handleCollectibleCollision(x, y, () => collectSound.play())
                    }
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
                    <Confetti width={800} height={400} />
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
