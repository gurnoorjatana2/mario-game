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
        { id: 1, x: 0, y: 380, width: 800, height: 20 }, // Initial ground platform
        { id: 2, x: 300, y: 300, width: 100, height: 20 },
    ]);
    const [enemies, setEnemies] = useState([
        { id: 1, x: 500, y: 270, isAlive: true, range: 100 },
    ]);
    const [collectibles, setCollectibles] = useState([
        { id: 1, x: 400, y: 270, collected: false },
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);
    const [gameWon, setGameWon] = useState(false);
    const [worldEnd, setWorldEnd] = useState(800); // Initial width of the game world

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

    // Load more obstacles as the player moves forward
    useEffect(() => {
        if (playerPosition.x > worldEnd - 400) {
            // Extend the world
            const newEnd = worldEnd + 800;
            setWorldEnd(newEnd);

            // Add new platforms
            const newPlatforms = [
                { id: platforms.length + 1, x: newEnd - 600, y: 300, width: 150, height: 20 },
                { id: platforms.length + 2, x: newEnd - 200, y: 250, width: 100, height: 20 },
                { id: platforms.length + 3, x: newEnd, y: 380, width: 800, height: 20 }, // Ground extension
            ];
            setPlatforms((prev) => [...prev, ...newPlatforms]);

            // Add new enemies
            const newEnemies = [
                { id: enemies.length + 1, x: newEnd - 500, y: 270, isAlive: true, range: 150 },
                { id: enemies.length + 2, x: newEnd - 300, y: 250, isAlive: true, range: 100 },
            ];
            setEnemies((prev) => [...prev, ...newEnemies]);

            // Add new collectibles
            const newCollectibles = [
                { id: collectibles.length + 1, x: newEnd - 450, y: 270, collected: false },
                { id: collectibles.length + 2, x: newEnd - 150, y: 220, collected: false },
            ];
            setCollectibles((prev) => [...prev, ...newCollectibles]);
        }
    }, [playerPosition.x, worldEnd, platforms, enemies, collectibles]);

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
            {/* Display score */}
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

            {/* Render character */}
            {isCharacterAlive && (
                <Character
                    onPositionUpdate={setPlayerPosition}
                    platforms={platforms}
                    enemies={enemies}
                    onEnemyCollision={handleEnemyCollision}
                />
            )}

            {/* Show "Game Over" screen */}
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
                        textAlign: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    🎉 Congratulations! You've completed the game! 🎉
                </div>
            )}
        </div>
    );
};

export default GameCanvas;







