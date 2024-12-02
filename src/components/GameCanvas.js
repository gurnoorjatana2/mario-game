import React, { useState, useEffect } from "react";
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import { Howl } from "howler";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 });
    const [enemies, setEnemies] = useState([
        { id: 1, x: 200, y: 270, isAlive: true, range: 100 }, // Enemy moves within a range
        { id: 2, x: 500, y: 270, isAlive: true, range: 100 },
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);

    // Define platforms
    const platforms = [
        { id: 1, x: 100, y: 300, width: 100, height: 20 },
        { id: 2, x: 300, y: 200, width: 100, height: 20 },
    ];

    // Handle collectible collection
    const handleCollect = () => {
        setScore((prevScore) => prevScore + 1);
    };

    // Handle enemy collision
    const handleEnemyCollision = (enemyId, wasJumpedOn) => {
        if (wasJumpedOn) {
            // Kill the enemy
            setEnemies((prevEnemies) =>
                prevEnemies.map((enemy) =>
                    enemy.id === enemyId ? { ...enemy, isAlive: false } : enemy
                )
            );
            setScore((prevScore) => prevScore + 10); // Bonus for defeating an enemy
        } else {
            // Character dies
            setIsCharacterAlive(false);
        }
    };

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
            {/* Display the score */}
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
                <Platform
                    key={platform.id}
                    x={platform.x}
                    y={platform.y}
                    width={platform.width}
                    height={platform.height}
                />
            ))}

            {/* Render collectibles */}
            {[{ x: 120, y: 270 }, { x: 320, y: 170 }].map((collectible, index) => (
                <Collectible
                    key={index}
                    x={collectible.x}
                    y={collectible.y}
                    playerPosition={playerPosition}
                    onCollect={handleCollect}
                />
            ))}

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
            {isCharacterAlive && (
                <Character
                    onPositionUpdate={setPlayerPosition}
                    platforms={platforms}
                    enemies={enemies}
                    onEnemyCollision={handleEnemyCollision}
                />
            )}
        </div>
    );
};

export default GameCanvas;
