export const level1 = {
    platforms: [
        { id: 1, x: 0, y: 380, width: 800, height: 20, color: "#8B4513" }, // Ground
        { id: 2, x: 200, y: 300, width: 150, height: 20, color: "#D2691E" }, // Elevated
        { id: 3, x: 600, y: 250, width: 200, height: 20, color: "#32CD32" }, // Higher
        { id: 4, x: 1000, y: 200, width: 250, height: 20, color: "#8B4513" }, // High platform
        { id: 5, x: 1400, y: 300, width: 200, height: 20, color: "#D2691E" }, // Elevated
        { id: 6, x: 1800, y: 250, width: 200, height: 20, color: "#32CD32" }, // Higher
        { id: 7, x: 2200, y: 300, width: 250, height: 20, color: "#D2691E" }, // Elevated
        { id: 8, x: 2600, y: 380, width: 800, height: 20, color: "#8B4513" }, // Ground extension
        { id: 9, x: 3400, y: 300, width: 200, height: 20, color: "#D2691E" }, // Elevated
        { id: 10, x: 3800, y: 250, width: 250, height: 20, color: "#32CD32" }, // Higher
        { id: 11, x: 4200, y: 200, width: 300, height: 20, color: "#8B4513" }, // High platform
        { id: 12, x: 4600, y: 300, width: 200, height: 20, color: "#D2691E" }, // Elevated
        { id: 13, x: 5000, y: 380, width: 800, height: 20, color: "#8B4513" }, // Ground extension
        { id: 14, x: 5800, y: 350, width: 250, height: 20, color: "#D2691E" }, // Elevated
        { id: 15, x: 6200, y: 250, width: 250, height: 20, color: "#32CD32" }, // Higher
        { id: 16, x: 6600, y: 200, width: 300, height: 20, color: "#8B4513" }, // High platform
        { id: 17, x: 7000, y: 350, width: 200, height: 20, color: "#D2691E" }, // Elevated
        { id: 18, x: 7400, y: 380, width: 800, height: 20, color: "#8B4513" }, // Ground extension
    ],
    collectibles: [
        { id: 1, x: 300, y: 270, collected: false, type: "doubleJump" }, // Reachable on elevated platform
        { id: 2, x: 700, y: 230, collected: false, type: "score" }, // Reachable on green platform
        { id: 3, x: 1150, y: 180, collected: false, type: "score" }, // Reachable on brown platform
        { id: 4, x: 1500, y: 270, collected: false, type: "score" }, // Reachable on brown platform
        { id: 5, x: 1900, y: 230, collected: false, type: "doubleJump" }, // Reachable on green platform
        { id: 6, x: 3300, y: 280, collected: false, type: "score" }, // Reachable on brown platform
        { id: 7, x: 3700, y: 230, collected: false, type: "doubleJump" }, // Reachable on green platform
        { id: 8, x: 4400, y: 180, collected: false, type: "score" }, // Reachable on brown platform
        { id: 9, x: 5200, y: 270, collected: false, type: "doubleJump" }, // Reachable on brown platform
    ],
    enemies: [
        { id: 1, x: 400, y: 350, range: 100, speed: 1, direction: 1 }, // On ground
        { id: 2, x: 800, y: 220, range: 100, speed: 1, direction: 1 }, // On green platform
        { id: 3, x: 1400, y: 270, range: 150, speed: 1, direction: 1 }, // On brown platform
        { id: 4, x: 2000, y: 350, range: 100, speed: 1, direction: -1 }, // On green platform
        { id: 5, x: 3000, y: 350, range: 200, speed: 1, direction: -1 }, // On elevated platform
        { id: 6, x: 3800, y: 230, range: 100, speed: 1, direction: 1 }, // On green platform
        { id: 7, x: 4500, y: 180, range: 150, speed: 1, direction: -1 }, // On brown platform
        { id: 8, x: 6000, y: 350, range: 100, speed: 1, direction: 1 }, // On elevated platform
    ],
    void: { y: 400 }, // Void position for instant death
    flag: { x: 7400, y: 300, width: 50, height: 80 },
};

export default level1;