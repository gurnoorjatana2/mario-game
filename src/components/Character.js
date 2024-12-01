import React, { useState, useEffect } from "react";
import { Howl } from "howler";

const Character = ({ setPlayerPosition }) => {
    const [position, setPosition] = useState({ x: 50, y: 300 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);

    // Jump sound
    const jumpSound = new Howl({
        src: ["/assets/jump.mp3"], // Make sure this path is correct
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") setVelocity((v) => ({ ...v, x: 5 }));
            if (e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: -5 }));
            if (e.key === " " && !isJumping) {
                jumpSound.play(); // Play jump sound
                setVelocity((v) => ({ ...v, y: -15 }));
                setIsJumping(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") setVelocity((v) => ({ ...v, x: 0 }));
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isJumping]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((pos) => {
                const newY = pos.y + velocity.y;
                const newX = pos.x + velocity.x;
                const isOnGround = newY >= 300; // Ground level

                const updatedPosition = {
                    x: newX,
                    y: isOnGround ? 300 : newY,
                };

                setPlayerPosition(updatedPosition); // Update position for collision checks
                return updatedPosition;
            });

            setVelocity((v) => ({
                x: v.x,
                y: v.y + 1, // Gravity
            }));

            if (position.y >= 300) setIsJumping(false); // Reset jump state
        }, 20);

        return () => clearInterval(interval);
    }, [velocity, position.y, setPlayerPosition]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: "30px",
                height: "30px",
                backgroundColor: "red",
            }}
        ></div>
    );
};

export default Character;
