import React, { useEffect, useState } from "react";

const Enemy = ({ x, y, width = 30, height = 30, speed = 2 }) => {
    const [position, setPosition] = useState({ x, y });
    const [direction, setDirection] = useState(1); // 1 for right, -1 for left

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((pos) => {
                let newX = pos.x + direction * speed;
                if (newX <= x || newX >= x + 100) {
                    setDirection((d) => -d); // Reverse direction
                }
                return { x: newX, y: pos.y };
            });
        }, 50);

        return () => clearInterval(interval);
    }, [x, direction, speed]);

    return (
        <div
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "purple",
                borderRadius: "50%",
            }}
        ></div>
    );
};

export default Enemy;
