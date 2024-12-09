export const level1 = {
    platforms: [
        { id: 1, x: 0, y: 380, width: 800, height: 20, color: "gray" }, // Ground
        { id: 2, x: 200, y: 300, width: 150, height: 20, color: "brown" }, // Elevated
        { id: 3, x: 600, y: 250, width: 200, height: 20, color: "green" }, // Higher
        { id: 4, x: 1000, y: 200, width: 250, height: 20, color: "brown" }, // High platform
        { id: 5, x: 1400, y: 300, width: 200, height: 20, color: "brown" }, // Elevated
        { id: 6, x: 1800, y: 250, width: 200, height: 20, color: "green" }, // Higher
        { id: 7, x: 2200, y: 300, width: 250, height: 20, color: "brown" }, // Elevated
        { id: 8, x: 2600, y: 380, width: 800, height: 20, color: "gray" }, // Ground extension
        { id: 9, x: 3400, y: 300, width: 200, height: 20, color: "brown" }, // Elevated
        { id: 10, x: 3800, y: 250, width: 250, height: 20, color: "green" }, // Higher
        { id: 11, x: 4200, y: 200, width: 300, height: 20, color: "brown" }, // High platform
        { id: 12, x: 4600, y: 300, width: 200, height: 20, color: "brown" }, // Elevated
        { id: 13, x: 5000, y: 380, width: 800, height: 20, color: "gray" }, // Ground extension
        { id: 14, x: 5800, y: 350, width: 250, height: 20, color: "brown" }, // Elevated
        { id: 15, x: 6200, y: 250, width: 250, height: 20, color: "green" }, // Higher
        { id: 16, x: 6600, y: 200, width: 300, height: 20, color: "brown" }, // High platform
        { id: 17, x: 7000, y: 350, width: 200, height: 20, color: "brown" }, // Elevated
        { id: 18, x: 7400, y: 380, width: 800, height: 20, color: "gray" }, // Ground extension
    ],
    collectibles: [
        { id: 1, x: 300, y: 270, collected: false, type: "doubleJump" }, // Reachable
        { id: 2, x: 700, y: 230, collected: false, type: "score" }, // Reachable
        { id: 3, x: 1150, y: 180, collected: false, type: "score" }, // Reachable
        { id: 4, x: 1500, y: 270, collected: false, type: "score" }, // Reachable
        { id: 5, x: 1900, y: 230, collected: false, type: "doubleJump" }, // Reachable
        { id: 6, x: 3300, y: 280, collected: false, type: "score" }, // Reachable
        { id: 7, x: 3700, y: 230, collected: false, type: "doubleJump" }, // Reachable
        { id: 8, x: 4400, y: 180, collected: false, type: "score" }, // Reachable
        { id: 9, x: 5200, y: 270, collected: false, type: "doubleJump" }, // Reachable
    ],
    enemies: [
        { id: 1, x: 400, y: 350, range: 100, speed: 1, direction: 1, isAlive: true }, // Ground
        { id: 2, x: 800, y: 220, range: 100, speed: 1, direction: 1, isAlive: true }, // Green platform
        { id: 3, x: 1400, y: 270, range: 150, speed: 1, direction: 1, isAlive: true }, // Brown platform
        { id: 4, x: 2000, y: 250, range: 100, speed: 1, direction: -1, isAlive: true }, // Elevated
        { id: 5, x: 3000, y: 350, range: 200, speed: 1, direction: -1, isAlive: true }, // Elevated
        { id: 6, x: 3800, y: 230, range: 100, speed: 1, direction: 1, isAlive: true }, // Green platform
        { id: 7, x: 4500, y: 180, range: 150, speed: 1, direction: -1, isAlive: true }, // Brown platform
        { id: 8, x: 6000, y: 350, range: 100, speed: 1, direction: 1, isAlive: true }, // Elevated
    ],
    flag: { x: 7700, y: 300, width: 50, height: 80 }, // Properly aligned
};

export default level1;