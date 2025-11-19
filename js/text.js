import * as THREE from 'three';
import createScene from './core/createScene.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const { scene, camera, renderer, controls } = createScene({
    cameraPosition: { x: 0, y: 1, z: 8 }
});

function getResponsiveTextSize() {
    const w = window.innerWidth;

    if (w > 1100) return 1.5;
    if (w > 900) return 1;
    if (w > 700) return 0.8;
    if (w > 500) return 0.6;
    return 0.4;
}
function getResponsiveSpacing() {
    const w = window.innerWidth;

    if (w > 1100) return 1.4;
    if (w > 900) return 1.1;
    if (w > 700) return 0.9;
    if (w > 500) return 0.7;
    return 0.5;
}
let textGroups = [];
const loader = new FontLoader();

const material = new THREE.MeshStandardMaterial({
    color: 0x4dff91,
    metalness: 0.3,
    roughness: 0.35
});
function createText(text, y) {
    textGroups = [];
    loader.load('/assets/Open Sans_Bold.json', (font) => {

        const size = getResponsiveTextSize();
        const geometry = new TextGeometry(text, {
            font: font,
            size: size,
            depth: 0.25 * size,
            bevelEnabled: true,
            bevelThickness: 0.03 * size,
            bevelSize: 0.02 * size,
            bevelSegments: 3
        });
        geometry.computeBoundingBox();
        geometry.center();

        const group = new THREE.Group();
        textGroups.push(group);
        scene.add(group);

        const textMesh = new THREE.Mesh(geometry, material);
        group.add(textMesh);

        // === EDGES ===
        const edgeLines = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        group.add(edgeLines);
        group.position.y = y;
    });
};

let spacing = getResponsiveSpacing();
createText('SAFAROFF', spacing);
createText('AGENCY', -spacing);

window.addEventListener("resize", () => {
    textGroups.forEach(group => { scene.remove(group); group.clear(); });
    const spacing = getResponsiveSpacing();

    createText('SAFAROFF', spacing);
    createText('AGENCY', -spacing);
});


function animate() {
    requestAnimationFrame(animate);


    if (controls) controls.update();
    renderer.render(scene, camera);
}
animate();