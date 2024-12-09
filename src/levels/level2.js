// src/levels/level2.js

export const level2 = {
    platforms: [
        { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" },
        { id: 2, x: 300, y: 300, width: 150, height: 20, color: "brown" },
        { id: 3, x: 700, y: 250, width: 100, height: 20, color: "green" },
        { id: 4, x: 1200, y: 200, width: 200, height: 20, color: "brown" },
        { id: 5, x: 1600, y: 300, width: 150, height: 20, color: "brown" },
        { id: 6, x: 2000, y: 250, width: 200, height: 20, color: "green" },
        { id: 7, x: 2500, y: 300, width: 150, height: 20, color: "brown" },
        { id: 8, x: 3000, y: 350, width: 800, height: 20, color: "gray" },
    ],
    collectibles: [
        { id: 1, x: 400, y: 250, collected: false, type: "doubleJump" },
        { id: 2, x: 1000, y: 200, collected: false, type: "score" },
        { id: 3, x: 1800, y: 250, collected: false, type: "score" },
        { id: 4, x: 2400, y: 200, collected: false, type: "doubleJump" },
    ],
    enemies: [
        { id: 1, x: 600, y: 350, isAlive: true },
        { id: 2, x: 1200, y: 350, isAlive: true },
        { id: 3, x: 1800, y: 350, isAlive: true },
        { id: 4, x: 2600, y: 350, isAlive: true },
    ],
    
    flag: { x: 2700, y: 300, width: 50, height: 80 },

};


export default level2;
