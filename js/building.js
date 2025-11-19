import * as THREE from 'three';
import createScene from './core/createScene.js';

const { scene, camera, renderer, controls } = createScene({
    cameraPosition: { x: 16, y: 5, z: 16 },
    fov: 100,
    controlsConfig: {
        minDistance: 6,
        maxDistance: 100,
    },
    fog: {
        enable: false,
    },
    light: {
        ambient: {
            enable: true,
            color: 0x8899bb,
            intensity: 0.4,
        },
        direction: {
            enable: true,
            color: 0xaaccff,
            intensity: 0.9,
            position: { x: 10, y: 20, z: 10 },
        }
    }
});

/**
 * 1-Parametrlər
 * 2-Divarlar
 * 3-Dam
 * 4-Qapi
 * 5-Pəncərələr
 * 6-Baca
 * 7-Torpaq
 */

// 1-Parametrlər
const config = {
    floors: 25,
    floorHeight: 0.7,

    building: { width: 5, depth: 3, color: 0xdddddd },
    roof: { height: 0.25, color: 0x777777 },
    chimney: { size: 0.6, height: 1.2, color: 0x3b3b3b },

    door: { width: 1.2, height: 1.5, color: 0x442a1a },

    windows: {
        w: 0.55,
        h: 0.38,
        d: 0.05,
        gapSide: 0.6,
        gapFront: 1.2
    },

    ground: { size: 50, color: 0x1a1a1a }
};


const buildingGroup = new THREE.Group();
scene.add(buildingGroup);

const totalHeight = config.floors * config.floorHeight;

// 2-Divarlar
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(config.building.width, totalHeight, config.building.depth),
    new THREE.MeshStandardMaterial({ color: config.building.color, roughness: 0.9, metalness: 0.1 })
);
walls.position.y = totalHeight / 2;
buildingGroup.add(walls);

// 3-Dam
const roof = new THREE.Mesh(
    new THREE.BoxGeometry(config.building.width + 0.2, config.roof.height, config.building.depth + 0.2),
    new THREE.MeshStandardMaterial({ color: config.roof.color, roughness: 0.8 })
);
roof.position.y = totalHeight + config.roof.height / 2;
buildingGroup.add(roof);

// 4-Qapi
const door = new THREE.Mesh(
    new THREE.BoxGeometry(config.door.width, config.door.height, 0.12),
    new THREE.MeshStandardMaterial({ color: config.door.color })
);
door.position.set(0, config.door.height / 2, config.building.depth / 2 + 0.02);
buildingGroup.add(door);

// 5-Pəncərələr
const windowGeometry = new THREE.BoxGeometry(
    config.windows.w,
    config.windows.h,
    config.windows.d
);

function createWindowMaterial() {
    const lightsOn = Math.random() > 0.5; // 50% işıqlı

    return new THREE.MeshStandardMaterial({
        color: lightsOn ? 0xffee88 : 0x111111,
        emissive: lightsOn ? 0xffdd88 : 0x000000,
        emissiveIntensity: lightsOn ? 1.0 : 0.0,
        roughness: 0.25,
        metalness: 0.1
    });
}

function addWindow(x, y, z, rotation = 0) {
    const win = new THREE.Mesh(windowGeometry, createWindowMaterial());
    win.position.set(x, y, z);
    win.rotation.y = rotation;
    buildingGroup.add(win);
}
for (let i = 0; i < config.floors - 2; i++) {
    const y = (i * config.floorHeight) + 1.2;

    const gf = config.windows.gapFront;
    const gs = config.windows.gapSide;

    // Front
    addWindow(-gf, y, config.building.depth / 2 + 0.02);
    addWindow(gf, y, config.building.depth / 2 + 0.02);

    // Back
    addWindow(-gf, y, -config.building.depth / 2 - 0.02, Math.PI);
    addWindow(gf, y, -config.building.depth / 2 - 0.02, Math.PI);

    // Left
    addWindow(-config.building.width / 2 - 0.02, y, -gs, Math.PI / 2);
    addWindow(-config.building.width / 2 - 0.02, y, gs, Math.PI / 2);

    // Right
    addWindow(config.building.width / 2 + 0.02, y, -gs, -Math.PI / 2);
    addWindow(config.building.width / 2 + 0.02, y, gs, -Math.PI / 2);
}

// 6-Baca
const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(config.chimney.size, config.chimney.height, config.chimney.size),
    new THREE.MeshStandardMaterial({ color: config.chimney.color, roughness: 0.8 })
);
chimney.position.set(
    config.building.width / 2 - 0.8,
    totalHeight + config.chimney.height / 2,
    0
);
buildingGroup.add(chimney);

// 7-Torpaq
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(config.ground.size, config.ground.size),
    new THREE.MeshStandardMaterial({ color: config.ground.color, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

function animate() {
    requestAnimationFrame(animate);

    if (controls) controls.update();
    renderer.render(scene, camera);
}
animate();