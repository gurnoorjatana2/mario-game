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
        { id: 1, x: 200, y: 270, isAlive: true },
        { id: 2, x: 500, y: 270, isAlive: true },
    ]);
    const [isCharacterAlive, setIsCharacterAlive] = useState(true);

    const platforms = [
        { x: 100, y: 300, width: 100, height: 20 },
        { x: 300, y: 200, width: 100, height: 20 },
    ];

    const handleCollect = () => {
        setScore((prevScore) => prevScore + 1);
    };

    const handleEnemyCollision = (enemyId, wasJumpedOn) => {
        if (wasJumpedOn) {
            // Kill the enemy
            setEnemies((prev) =>
                prev.map((enemy) => (enemy.id === enemyId ? { ...enemy, isAlive: false } : enemy))
            );
            setScore((prev) => prev + 10); // Bonus for defeating an enemy
        } else {
            // Character dies
            setIsCharacterAlive(false);
        }
    };

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

            {platforms.map((platform, index) => (
                <Platform key={index} x={platform.x} y={platform.y} />
            ))}

            <Collectible x={120} y={270} playerPosition={playerPosition} onCollect={handleCollect} />
            <Collectible x={320} y={170} playerPosition={playerPosition} onCollect={handleCollect} />

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
