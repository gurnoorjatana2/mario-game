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
    const [enemies, setEnemies] = useState([
        { id: 1, x: 200, y: 350, isAlive: true, range: 100 },
        { id: 2, x: 500, y: 350, isAlive: true, range: 100 },
    ]);
    const [collectibles, setCollectibles] = useState([
        { id: 1, x: 300, y: 300, collected: false },
        { id: 2, x: 700, y: 250, collected: false },
    ]);
    const [platforms, setPlatforms] = useState([
        { id: 1, x: 0, y: 380, width: 800, height: 20 }, // Initial ground platform
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;

    const coinSound = new Howl({ src: ["/assets/coin.mp3"], volume: 0.8 });
    const backgroundMusic = new Howl({
        src: ["/assets/background-music.mp3"],
        loop: true,
        volume: 0.5,
    });

    // Handle collectible collection
    const handleCollect = (collectibleId) => {
        setCollectibles((prev) =>
            prev.map((collectible) =>
                collectible.id === collectibleId ? { ...collectible, collected: true } : collectible
            )
        );
        setScore((prev) => prev + 5);
        coinSound.play();
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

    // Generate platforms and obstacles dynamically
    useEffect(() => {
        if (playerPosition.x > worldOffset + CANVAS_WIDTH / 2) {
            const nextPlatformX = worldOffset + CANVAS_WIDTH;

            // Add new platform
            setPlatforms((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextPlatformX,
                    y: 380,
                    width: 800,
                    height: 20, // Ground
                },
            ]);

            // Add new collectible
            setCollectibles((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextPlatformX + Math.random() * 200 + 100,
                    y: Math.random() * (CANVAS_HEIGHT - 150) + 100,
                    collected: false,
                },
            ]);

            // Add new enemy
            setEnemies((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    x: nextPlatformX + Math.random() * 200 + 150,
                    y: 350,
                    isAlive: true,
                    range: Math.random() * 100 + 50,
                },
            ]);

            setWorldOffset(nextPlatformX - CANVAS_WIDTH);
            setScreenShiftCount((prev) => prev + 1);
        }
    }, [playerPosition.x, worldOffset]);

    // Check win condition
    useEffect(() => {
        if (screenShiftCount >= 2) {
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

            {/* Moving game world */}
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
                        color={"brown"}
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
                    <br />
                    Score: {score}
                </div>
            )}

            {/* Victory */}
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
