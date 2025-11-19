import * as THREE from 'three';
import createScene from './core/createScene.js';

const { scene, camera, renderer, controls } = createScene({
    cameraPosition: { x: 0, y: 1, z: 8 }
});

/**
 * 1-Parametrlər
 * 2-Divarlar
 * 3-Dam
 * 4-Qapi
 * 5-Pəncərələr
 * 6-Baca
 * 7-Tustu Animasiyasi
 */

// 1-Parametrlər
const houseConfig = {
    walls: {
        size: { x: 3, y: 2, z: 3 },
        color: 0xf5f5f5
    },
    roof: {
        radius: 2.7,
        height: 1.4,
        color: 0xAA3A3A
    },
    door: {
        size: { x: 0.8, y: 1.3, z: 0.12 },
        color: 0x5a3d2e
    },
    window: {
        size: { x: 0.75, y: 0.6, z: 0.05 },
        color: 0x88ccff
    },
    chimney: {
        size: { x: 0.45, y: 0.9, z: 0.45 },
        color: 0x555555
    },
    smoke: {
        maxParticles: 40,
        color: 0xffffff
    }
};

const house = new THREE.Group();
scene.add(house);

// 2-Divarlar
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(
        houseConfig.walls.size.x,
        houseConfig.walls.size.y,
        houseConfig.walls.size.z
    ),
    new THREE.MeshStandardMaterial({ color: houseConfig.walls.color })
);
house.add(walls);
// 3-Dam
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(
        houseConfig.roof.radius,
        houseConfig.roof.height,
        4
    ),
    new THREE.MeshStandardMaterial({ color: houseConfig.roof.color })
);
roof.position.y = houseConfig.walls.size.y / 2 + 0.7;
roof.rotation.y = Math.PI / 4;
house.add(roof);
// 4-Qapi
const door = new THREE.Mesh(
    new THREE.BoxGeometry(
        houseConfig.door.size.x,
        houseConfig.door.size.y,
        houseConfig.door.size.z
    ),
    new THREE.MeshStandardMaterial({ color: houseConfig.door.color })
);
door.position.set(0, -0.4, houseConfig.walls.size.z / 2 + 0.02);
house.add(door);
// 5-Pəncərələr
function createWindow(x, y, z, flip = false) {
    const win = new THREE.Mesh(
        new THREE.BoxGeometry(
            houseConfig.window.size.x,
            houseConfig.window.size.y,
            houseConfig.window.size.z
        ),
        new THREE.MeshStandardMaterial({
            color: houseConfig.window.color,
            emissive: 0x113344,
            metalness: 0.1,
            roughness: 0.15
        })
    );
    win.position.set(x, y, z);
    if (flip) win.rotation.y = Math.PI;
    house.add(win);
}

createWindow(-0.9, 0.2, houseConfig.walls.size.z / 2 + 0.02);
createWindow(0.9, 0.2, houseConfig.walls.size.z / 2 + 0.02, true);

// 6-Baca
const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(
        houseConfig.chimney.size.x,
        houseConfig.chimney.size.y,
        houseConfig.chimney.size.z
    ),
    new THREE.MeshStandardMaterial({ color: houseConfig.chimney.color })
);
chimney.position.set(1, 1.5, -0.3);
house.add(chimney);

// 7-Tustu Animasiyasi
let smokeParticles = [];

function createSmoke() {
    if (smokeParticles.length >= houseConfig.smoke.maxParticles) return;

    const smoke = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshStandardMaterial({
            color: houseConfig.smoke.color,
            transparent: true,
            opacity: 0.8
        })
    );

    smoke.position.set(
        chimney.position.x,
        chimney.position.y + 0.5,
        chimney.position.z
    );

    smoke.scale.set(1, 1, 1);

    smokeParticles.push(smoke);
    house.add(smoke);
}

function animate() {
    requestAnimationFrame(animate);

    // 7-Tustu Animasiyasi
    smokeParticles.forEach((p, i) => {
        p.position.y += 0.013;
        p.position.x += Math.sin(Date.now() * 0.001 + i) * 0.002;
        p.scale.multiplyScalar(1.007);
        p.material.opacity -= 0.003;

        if (p.material.opacity <= 0) {
            house.remove(p);
            smokeParticles.splice(i, 1);
        }
    });
    if (Math.random() > 0.9) createSmoke();

    if (controls) controls.update();
    renderer.render(scene, camera);
}
animate();