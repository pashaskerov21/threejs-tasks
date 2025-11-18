import * as THREE from 'three';
import createScene from './core/createScene.js';

const { scene, camera, renderer, controls } = createScene({
    cameraPosition: { x: 0, y: 1, z: 8 }
});

const material = new THREE.MeshStandardMaterial({
    color: 0x4dff91,
    metalness: 0.15,
    roughness: 0.35,
});

const geometries = [
    new THREE.BoxGeometry(1, 1, 1),              // Cube
    new THREE.SphereGeometry(0.7, 32, 32),       // Sphere
    new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32), // Cylinder
    new THREE.TorusGeometry(0.6, 0.25, 16, 100), // Torus
    new THREE.ConeGeometry(0.8, 1.2, 4),         // Pyramid (Cone with 4 sides)
];

geometries.forEach((geo, i) => {
    const group = new THREE.Group();
    scene.add(group);

    const mesh = new THREE.Mesh(geo, material.clone());
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    group.add(edgeLines);

});
function layoutFigures() {
    const spacing = Math.min(2.2, window.innerWidth / 400);
    const scaleFactor = Math.min(1, window.innerWidth / 700);

    const groups = scene.children.filter(obj => obj.type === "Group");

    groups.forEach((group, i) => {
        group.position.x = (i - (groups.length - 1) / 2) * spacing;
        group.scale.set(scaleFactor, scaleFactor, scaleFactor);
    });
}
layoutFigures();
window.addEventListener("resize", layoutFigures);



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
let delta = { x: 0, y: 0 };

function updatePointer(clientX, clientY) {
    const normalizedX = (clientX / window.innerWidth) * 2 - 1;
    const normalizedY = -(clientY / window.innerHeight) * 2 + 1;

    // Delta hesabla (mouse-un istiqaməti)
    delta.x = normalizedX - mouse.x;
    delta.y = normalizedY - mouse.y;

    // Son mouse koordinatlarını saxla
    mouse.x = normalizedX;
    mouse.y = normalizedY;
}

window.addEventListener("mousemove", (event) => {
    updatePointer(event.clientX, event.clientY);
});
window.addEventListener("touchmove", (event) => {
    const touch = event.touches[0];
    updatePointer(touch.clientX, touch.clientY);
});

function animate() {
    requestAnimationFrame(animate);

    scene.traverse(obj => {
        if (obj.type === "Group") {
            obj.rotation.y += 0.01;
            obj.rotation.x += 0.005;
        }
    });

    raycaster.setFromCamera(mouse, camera);
    const groups = scene.children.filter(obj => obj.type === "Group");
    const intersects = raycaster.intersectObjects(groups, true);

    if (intersects.length > 0) {
        hoveredObject = intersects[0].object.parent;
    } else {
        hoveredObject = null;
    }

    if (hoveredObject) {
        hoveredObject.rotation.y += delta.x * 10;  // sağ-sol
        hoveredObject.rotation.x -= delta.y * 10;  // yuxarı-aşağı
    }


    if (controls) controls.update();
    renderer.render(scene, camera);
}
animate();