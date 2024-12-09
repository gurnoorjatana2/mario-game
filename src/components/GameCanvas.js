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
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const [paused, setPaused] = useState(false);
    const [doubleJumpEnabled, setDoubleJumpEnabled] = useState(false);
    const [currentCollectibles, setCurrentCollectibles] = useState([]);
    const [currentEnemies, setCurrentEnemies] = useState([]);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    const platforms = [
        { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" },
        { id: 2, x: 200, y: 300, width: 150, height: 20, color: "brown" },
        { id: 3, x: 600, y: 250, width: 100, height: 20, color: "green" },
        { id: 4, x: 1000, y: 200, width: 200, height: 20, color: "brown" },
        { id: 5, x: 1400, y: 300, width: 150, height: 20, color: "brown" },
        { id: 6, x: 1800, y: 250, width: 200, height: 20, color: "green" },
        { id: 7, x: 2200, y: 300, width: 150, height: 20, color: "brown" },
        { id: 8, x: 2600, y: 350, width: 800, height: 20, color: "gray" },
    ];

    const initialCollectibles = [
        { id: 1, x: 300, y: 250, collected: false, type: "doubleJump" },
        { id: 2, x: 800, y: 200, collected: false, type: "score" },
        { id: 3, x: 1500, y: 250, collected: false, type: "score" },
        { id: 4, x: 2000, y: 200, collected: false, type: "doubleJump" },
    ];

    const initialEnemies = [
        { id: 1, x: 400, y: 350, isAlive: true },
        { id: 2, x: 700, y: 350, isAlive: true },
        { id: 3, x: 1200, y: 350, isAlive: true },
        { id: 4, x: 1800, y: 350, isAlive: true },
    ];

    // Sound Effects
    const coinSound = new Howl({ src: ["/assets/coin.mp3"], volume: 0.8 });
    const powerUpSound = new Howl({ src: ["/assets/power-up.mp3"], volume: 0.8 });
    const backgroundMusic = new Howl({
        src: ["/assets/background-music.mp3"],
        loop: true,
        volume: 0.5,
    });

    // Initialize state for collectibles and enemies
    useEffect(() => {
        setCurrentCollectibles(initialCollectibles);
        setCurrentEnemies(initialEnemies);
    }, []);

    // Handle collectible collection
    const handleCollect = (collectibleId, type) => {
        setCurrentCollectibles((prev) =>
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
            setCurrentEnemies((prev) =>
                prev.map((enemy) =>
                    enemy.id === enemyId ? { ...enemy, isAlive: false } : enemy
                )
            );
            setScore((prev) => prev + 10);
        } else {
            setLives((prev) => Math.max(prev - 1, 0));
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
        setCurrentCollectibles(initialCollectibles);
        setCurrentEnemies(initialEnemies);
    };

    // Restart the game
    const restartGame = () => {
        setScore(0);
        setLives(3);
        setGameWon(false);
        restartLevel();
    };

    // Pause the game
    const togglePause = () => {
        setPaused((prev) => !prev);
    };

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
                border: "2px solid black",
                background: "url(/assets/background.png) repeat-x",
                backgroundSize: "cover",
            }}
        >
            {/* Score and Lives */}
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

            {/* Game World */}
            <div
                style={{
                    position: "relative",
                    width: "3000px",
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
                {currentCollectibles.map(
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
                {currentEnemies.map(
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
                        enemies={currentEnemies}
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
                    </div>
                </>
            )}
        </div>
    );
};

export default GameCanvas;
