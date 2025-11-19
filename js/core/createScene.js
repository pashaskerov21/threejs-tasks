import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function createScene(options = {}) {
    const {
        id = null,
        background = 0x1a1a1a,
        fog = {},

        cameraPosition = { x: 0, y: 0, z: 3 },
        fov = 75,
        near = 0.1,
        far = 100,

        enableControls = true,

        controlsConfig = {},

        light = {},
        shadow = true,
        canvasParent = document.body
    } = options;

    const {
        enable: fogEnable = true,
        color: fogColor = 0x000000,
        density: fogDensity = 0.05,
    } = fog;

    const {
        enableDamping = true,
        minDistance = 2,
        maxDistance = 10,
        minPolarAngle = 0,
        maxPolarAngle = Math.PI / 2,
    } = controlsConfig;

    const {
        ambient = {},
        direction = {},
    } = light;

    const {
        enable: ambientEnable = true,
        color: ambientColor = 0xffffff,
        intensity: ambientIntensity = 0.5,
    } = ambient;

    const {
        enable: dirEnable = true,
        color: dirColor = 0xffffff,
        intensity: dirIntensity = 0.5,
        position: dirPos = { x: 3, y: 5, z: 3 },
    } = direction;



    let canvas;
    if (id) {
        const el = document.getElementById(id);

        if (el && el.tagName === 'CANVAS') {
            canvas = el;
        } else {
            canvas = document.createElement("canvas");
            canvas.id = id;
            canvasParent.appendChild(canvas);
        }
    } else {
        canvas = document.createElement("canvas");
        canvasParent.appendChild(canvas);
    }


    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);
    if (fogEnable) {
        scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    }

    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (shadow) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    let controls = null;
    if (enableControls) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = enableDamping;

        controls.minDistance = minDistance;
        controls.maxDistance = maxDistance;
        controls.minPolarAngle = minPolarAngle;
        controls.maxPolarAngle = maxPolarAngle;
    }

    if (ambientEnable) {
        const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
        scene.add(ambientLight);
    }
    if (dirEnable) {
        const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
        dirLight.position.set(dirPos.x, dirPos.y, dirPos.z);
        scene.add(dirLight);
    }
    window.addEventListener("resize", () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    })

    return { scene, camera, renderer, controls, canvas }
}

