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
    const [worldOffset, setWorldOffset] = useState(0);
    const [screenShiftCount, setScreenShiftCount] = useState(0);
    const [platforms, setPlatforms] = useState([
        { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" }, // Initial ground platform
        { id: 2, x: 200, y: 300, width: 150, height: 20, color: "brown" }, // Elevated platform
        { id: 3, x: 600, y: 250, width: 100, height: 20, color: "green" }, // Higher platform
    ]);
    const [enemies, setEnemies] = useState([
        { id: 1, x: 300, y: 350, isAlive: true, range: 100 },
        { id: 2, x: 700, y: 350, isAlive: true, range: 100 },
    ]);
    const [collectibles, setCollectibles] = useState([
        { id: 1, x: 350, y: 250, collected: false },
        { id: 2, x: 750, y: 200, collected: false, type: "score" }, // Regular collectible
        { id: 3, x: 450, y: 300, collected: false, type: "doubleJump" }, // Double jump power-up
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const [nextGroundPlatformX, setNextGroundPlatformX] = useState(800); // Next ground platform position
    const [doubleJumpEnabled, setDoubleJumpEnabled] = useState(false); // Double jump power-up

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    // Sound effects
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
            setIsCharacterAlive(false);
        }
    };

    // Dynamically extend ground/floor platforms
    useEffect(() => {
        if (playerPosition.x > nextGroundPlatformX - CANVAS_WIDTH / 2) {
            setPlatforms((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextGroundPlatformX,
                    y: 380,
                    width: 800,
                    height: 20,
                    color: "gray",
                },
            ]);
            setNextGroundPlatformX((prev) => prev + 800);
        }
    }, [playerPosition.x, nextGroundPlatformX]);

    // Add new elevated platforms, enemies, and collectibles dynamically
    useEffect(() => {
        if (playerPosition.x > nextGroundPlatformX - CANVAS_WIDTH / 2) {
            setPlatforms((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextGroundPlatformX + Math.random() * 200,
                    y: Math.random() * (CANVAS_HEIGHT - 150) + 100,
                    width: Math.random() * 200 + 100,
                    height: 20,
                    color: "brown",
                },
            ]);

            setCollectibles((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextGroundPlatformX + Math.random() * 200 + 50,
                    y: Math.random() * (CANVAS_HEIGHT - 150) + 100,
                    collected: false,
                    type: Math.random() < 0.2 ? "doubleJump" : "score", // Randomly assign type
                },
            ]);

            setEnemies((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextGroundPlatformX + Math.random() * 200 + 100,
                    y: 350,
                    isAlive: true,
                    range: Math.random() * 100 + 50,
                },
            ]);

            setScreenShiftCount((prev) => prev + 1);
        }
    }, [playerPosition.x, nextGroundPlatformX]);

    // Check win condition
    useEffect(() => {
        if (screenShiftCount >= 3) {
            setGameWon(true);
        }
    }, [screenShiftCount]);

    // Update world offset based on character position
    useEffect(() => {
        if (playerPosition.x > CANVAS_WIDTH / 2) {
            setWorldOffset(playerPosition.x - CANVAS_WIDTH / 2);
        }
    }, [playerPosition]);

    // Play background music
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
                border: "2px solid black",
                background: "url(/assets/background.png) repeat-x",
                backgroundSize: "cover",
            }}
        >
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
                    position: "relative",
                    width: "4000px",
                    height: `${CANVAS_HEIGHT}px`,
                    transform: `translateX(-${worldOffset}px)`,
                }}
            >
                {/* Render Platforms */}
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

                {/* Render Collectibles */}
                {collectibles.map(
                    (collectible) =>
                        !collectible.collected && (
                            <Collectible
                                key={collectible.id}
                                x={collectible.x}
                                y={collectible.y}
                                playerPosition={playerPosition}
                                onCollect={() => handleCollect(collectible.id, collectible.type)}
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
                    <br />
                    Score: {score}
                </div>
            )}

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
