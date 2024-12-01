import React, { useState, useEffect } from "react"; // Added useEffect to the imports
import Character from "./Character";
import Platform from "./Platform";
import Enemy from "./Enemy";
import Collectible from "./Collectible";
import { Howl } from "howler";

const GameCanvas = () => {
    const [score, setScore] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 300 }); // Track player position

    const handleCollect = () => {
        setScore((prevScore) => prevScore + 1);
    };

    useEffect(() => {
        const backgroundMusic = new Howl({
            src: ["/assets/background-music.mp3"],
            loop: true,
            volume: 0.5,
        });

        backgroundMusic.play();

        return () => {
            backgroundMusic.stop(); // Stop music when the component unmounts
        };
    }, []); // Empty dependency array ensures this runs once when the component mounts

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

            {/* Platforms */}
            <Platform x={100} y={300} />
            <Platform x={300} y={200} />

            {/* Collectibles */}
            <Collectible x={120} y={270} playerPosition={playerPosition} onCollect={handleCollect} />
            <Collectible x={320} y={170} playerPosition={playerPosition} onCollect={handleCollect} />

            {/* Enemies */}
            <Enemy x={200} y={270} />
            <Enemy x={500} y={270} />

            {/* Player Character */}
            <Character setPlayerPosition={setPlayerPosition} />
        </div>
    );
};

export default GameCanvas;
