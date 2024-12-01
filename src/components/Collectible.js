import React, { useState } from "react";
import { motion } from "framer-motion";

const Collectible = ({ x, y, width = 20, height = 20, playerPosition, onCollect }) => {
    const [isVisible, setIsVisible] = useState(true);
    const playerWidth = 30;

    // Check collision
    const isCollected =
        playerPosition.x < x + width &&
        playerPosition.x + playerWidth > x &&
        playerPosition.y < y + height &&
        playerPosition.y + playerWidth > y;

    if (isCollected && isVisible) {
        setIsVisible(false); // Hide collectible
        onCollect();
    }

    return (
        isVisible && (
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.2 }}
                exit={{ opacity: 0, scale: 0 }} // Fade-out animation
                style={{
                    position: "absolute",
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: "gold",
                    borderRadius: "50%",
                }}
            ></motion.div>
        )
    );
};

export default Collectible;
