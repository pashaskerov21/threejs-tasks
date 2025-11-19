import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";



// === SETUP ===
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 900;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // ✨ Mobil üçün performans optimallaşdırması
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 200;
controls.maxDistance = 1200;

// === STARS ===
const starTexture = new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/circle.png");

function createStars(count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3); // ⭐ Rənglər üçün buffer

    const colorChoices = [
        new THREE.Color(0xffffff), // ağ
        new THREE.Color(0xffd966), // sarı
        new THREE.Color(0xff6f6f), // qırmızı
    ];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Mövqe
        positions[i3 + 0] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;

        // Rəngi random seçirik
        const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];

        colors[i3 + 0] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); 

    const material = new THREE.PointsMaterial({
        map: starTexture,
        vertexColors: true, 
        transparent: true,
        size: 1.2,
        sizeAttenuation: true,
        alphaTest: 0.01
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}
createStars(6000); 

// === SUN (GLTF Model) ===
function createSun() {
    const loader = new GLTFLoader();

    loader.load("/assets/sun_model/scene.gltf", (gltf) => {
        const sun = gltf.scene.children[0];
        sun.scale.set(0.03, 0.03, 0.03)

        scene.add(gltf.scene);

    });
}
createSun();

// === BLOOM ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.3, 0.3, 0.85));

// === SMOOTH ROTATION ===
let rotationSpeed = 0.0004;
let rotationTarget = rotationSpeed;
let lastScroll = 0;

window.addEventListener("wheel", (event) => {
    rotationTarget = event.deltaY > 0 ? 0.02 : -0.02;
    lastScroll = performance.now();
});

// === ANIMATE ===
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // Kamera yavaş-yavaş minDistance-ə yaxınlaşır
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 300, 0.002);

    if (performance.now() - lastScroll > 100) rotationTarget = 0.0004;
    rotationSpeed = THREE.MathUtils.lerp(rotationSpeed, rotationTarget, 0.05);

    scene.rotation.y += rotationSpeed;
    composer.render();
}
animate();

// === RESIZE ===
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
