import * as THREE from 'three';
import createScene from './core/createScene.js';

const { scene, camera, renderer, controls } = createScene({
    cameraPosition: { x: 10, y: 20, z: 40 },
    fov: 70,
    controlsConfig: {
        minDistance: 20,
        maxDistance: 70,
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

// ----CITY ROADMAP----

// 1-EV YARATMA FUNKSIYASI
//      1.1-EV UCUN PARAMETRLER
//      1.2-DIVARLAR
//      1.3-DAM ORTUYU
//      1.4-QAPI
//      1.5-PENCERELER
//      1.6-BACA
// 2-BINA YARATMA FUNKSIYASI
//      2.1-BİNA PARAMETRLƏRİ
//      2.2-GOVDE
//      2.3-DAM
//      2.4-BACA
//      2.5-QAPI
//      2.6-PENCERELER
// 3-EVLERIN YERLESDIRILMESI
// 4-BINALARIN YERLESDIRILMESI
// 5-EV ERAZISININ YER SETHI
// 6-EV ERAZISININ HORIZONTAL YOL XETLERI
// 7-EV ERAZISININ VERTICAL YOL XETLERI
// 8-BINA ERAZISININ YER SETHI
// 9-BINA ERAZISININ HORIZONTAL YOL XETLERI
// 10-BINA ERAZISININ VERTICAL YOL XETLERI
// 11-UMUMI ERAZININ YER SETHI
// 12-ANIMATE LOOP
// 13-RESIZE

camera.lookAt(0, 5, 0);
// 1-EV YARATMA FUNKSIYASI
function createHouse(x, z) {
    const group = new THREE.Group();
    scene.add(group);
    // 1.1-BINA UCUN PARAMETRLER
    const cfg = {
        wall: { w: 3, h: 2, d: 3, color: 0xdddddd },
        roof: { r: 2.6, h: 1.5, segments: 4, color: 0x884444 },
        door: { w: 0.8, h: 1.2, d: 0.1, color: 0x654321 },
        window: { w: 0.7, h: 0.5, d: 0.05, color: 0x66ccff },
        chimney: { w: 0.4, h: 0.8, d: 0.3, color: 0x444444 }
    };
    // 2.2-DIVARLAR
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.wall.w, cfg.wall.h, cfg.wall.d),
        new THREE.MeshStandardMaterial({ color: cfg.wall.color })
    );
    walls.position.set(x, cfg.wall.h / 2, z);
    group.add(walls);
    // 2.3-DAM ORTUYU
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(cfg.roof.r, cfg.roof.h, cfg.roof.segments),
        new THREE.MeshStandardMaterial({ color: cfg.roof.color })
    );
    roof.position.set(x, cfg.wall.h + cfg.roof.h / 2, z);
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
    // 2.4-QAPI
    const door = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.door.w, cfg.door.h, cfg.door.d),
        new THREE.MeshStandardMaterial({ color: cfg.door.color })
    );
    door.position.set(x, cfg.door.h / 2, z + cfg.wall.d / 2 + cfg.door.d / 2);
    group.add(door);
    // 2.5-PENCERELER
    const windowMat = new THREE.MeshStandardMaterial({
        color: cfg.window.color,
        emissive: 0x113344,
        roughness: 0.25,
        metalness: 0.1
    });
    const win1 = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.window.w, cfg.window.h, cfg.window.d),
        windowMat
    );
    win1.position.set(x - 1, 1.2, z + cfg.wall.d / 2 + cfg.window.d / 2);
    group.add(win1);
    const win2 = win1.clone();
    win2.position.x = x + 1;
    group.add(win2);
    // 2.6-BACA
    const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.chimney.w, cfg.chimney.h, cfg.chimney.d),
        new THREE.MeshStandardMaterial({ color: cfg.chimney.color })
    );
    chimney.position.set(x + 0.8, cfg.wall.h + cfg.roof.h - 0.6, z + 0.3);
    group.add(chimney);

}
// 3-BINA YARATMA FUNKSIYASI
function createBuilding(x, z) {
    const group = new THREE.Group();
    scene.add(group);
    // 3.1-BİNA PARAMETRLƏRİ
    const floors = 16;
    const floorHeight = 0.7;
    const buildingHeight = floors * floorHeight;

    const cfg = {
        wall: { w: 5, h: buildingHeight, d: 3, color: 0xdddddd },
        roof: { w: 5.4, h: 0.25, d: 3.4, color: 0x777777 },
        door: { w: 1.2, h: 1.5, d: 0.12, color: 0x442a1a },
        chimney: { w: 0.6, h: 1.2, d: 0.6, color: 0x3b3b3b }
    };

    const halfW = cfg.wall.w / 2;           // 2.5
    const halfDepth = cfg.wall.d / 2;       // = 3 / 2 = 1.5
    const windowDepth = 0.05;               // pəncərənin dərinliyi
    const windowHalf = windowDepth / 2;     // = 0.025
    const surfaceOffset = 0.06;             // divardan az kənar çıxma


    // === UTIL (mesh generator) ===
    const make = (geo, color) => new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 })
    );
    // 3.2-GOVDE
    const body = make(new THREE.BoxGeometry(cfg.wall.w, cfg.wall.h, cfg.wall.d), cfg.wall.color);
    body.position.set(x, cfg.wall.h / 2, z);
    group.add(body);
    // 3.3-DAM
    const roof = make(new THREE.BoxGeometry(cfg.roof.w, cfg.roof.h, cfg.roof.d), cfg.roof.color);
    roof.position.set(x, cfg.wall.h + cfg.roof.h / 2, z);
    group.add(roof);
    // 3.4-BACA
    const chimney = make(
        new THREE.BoxGeometry(cfg.chimney.w, cfg.chimney.h, cfg.chimney.d),
        cfg.chimney.color
    );
    chimney.position.set(x + halfW - 1.1, cfg.wall.h + cfg.chimney.h / 2, z);
    group.add(chimney);
    // 3.5-QAPI
    const door = make(
        new THREE.BoxGeometry(cfg.door.w, cfg.door.h, cfg.door.d),
        cfg.door.color
    );
    door.position.set(x, cfg.door.h / 2, z + halfDepth + cfg.door.d / 2);
    group.add(door);

    // 3.6-PENCERELER
    const windowGeo = new THREE.BoxGeometry(0.55, 0.38, 0.05);

    function windowMat() {
        const lightsOn = Math.random() > 0.45;
        return new THREE.MeshStandardMaterial({
            color: lightsOn ? 0xffee88 : 0x111111,
            emissive: lightsOn ? 0xffdd88 : 0x000000,
            emissiveIntensity: lightsOn ? 1.0 : 0.0,
            roughness: 0.25,
            metalness: 0.15
        });
    }

    for (let i = 0; i < floors - 2; i++) {
        const y = (i * floorHeight) + 1.2;

        // === ÖN ÜZ ===
        const w1 = new THREE.Mesh(windowGeo, windowMat());
        w1.position.set(x - 1.2, y, z + halfDepth + windowHalf + surfaceOffset);
        group.add(w1);

        const w2 = new THREE.Mesh(windowGeo, windowMat());
        w2.position.set(x + 1.2, y, z + halfDepth + windowHalf + surfaceOffset);
        group.add(w2);

        // === ARXA ÜZ ===
        const w3 = new THREE.Mesh(windowGeo, windowMat());
        w3.position.set(x - 1.2, y, z - halfDepth - windowHalf - surfaceOffset);
        w3.rotation.y = Math.PI;
        group.add(w3);

        const w4 = new THREE.Mesh(windowGeo, windowMat());
        w4.position.set(x + 1.2, y, z - halfDepth - windowHalf - surfaceOffset);
        w4.rotation.y = Math.PI;
        group.add(w4);

        // === SOL ÜZ ===
        const w5 = new THREE.Mesh(windowGeo, windowMat());
        w5.position.set(x - (cfg.wall.w / 2) - windowHalf - surfaceOffset, y, z - 0.6);
        w5.rotation.y = Math.PI / 2;
        group.add(w5);

        const w6 = w5.clone();
        w6.position.z = z + 0.6;
        group.add(w6);

        // === SAĞ ÜZ ===
        const w7 = new THREE.Mesh(windowGeo, windowMat());
        w7.position.set(x + (cfg.wall.w / 2) + windowHalf + surfaceOffset, y, z - 0.6);
        w7.rotation.y = -Math.PI / 2;
        group.add(w7);

        const w8 = w7.clone();
        w8.position.z = z + 0.6;
        group.add(w8);
    }

}

// 4-EVLERIN YERLESDIRILMESI
const houseRows = 4;        // cərgə sayı
const housePerRow = 6;      // hər cərgədə ev sayı
const houseSpacingX = 6;    // evlər arası yana məsafə
const houseSpacingZ = 6;    // cərgələr arası dərinlik məsafəsi

for (let r = 0; r < houseRows; r++) {
    for (let c = 0; c < housePerRow; c++) {

        const x = c * houseSpacingX - ((housePerRow - 1) * houseSpacingX) / 2;
        const z = r * houseSpacingZ;

        createHouse(x, z);
    }
}

// 5-BINALARIN YERLESDIRILMESI
const buildingRows = 3;       // bina cərgələri sayı
const buildingsPerRow = 4;    // hər cərgədə bina sayı
const buildingSpacingX = 8;   // binalar arası məsafə (evlərdən daha geniş)
const buildingSpacingZ = 8;   // cərgələr arası məsafə

for (let r = 0; r < buildingRows; r++) {
    for (let c = 0; c < buildingsPerRow; c++) {

        const x = c * buildingSpacingX - ((buildingsPerRow - 1) * buildingSpacingX) / 2;

        // ✅ Binalar evlərin arxasında
        const z = r * buildingSpacingZ - 30;

        createBuilding(x, z);
    }
}

// 6-EV ERAZISININ YER SETHI
const hoodWidth = housePerRow * houseSpacingX + 4;   // bir az kənardan istifadə üçün
const hoodDepth = houseRows * houseSpacingZ + 4;

const hoodGeometry = new THREE.PlaneGeometry(hoodWidth, hoodDepth);
const hoodMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 1 });
const neighborhoodGround = new THREE.Mesh(hoodGeometry, hoodMaterial);
neighborhoodGround.rotation.x = -Math.PI / 2;
neighborhoodGround.position.set(0, 0.01, (houseRows * houseSpacingZ) / 2 - 3);
scene.add(neighborhoodGround);
// 7-EV ERAZISININ HORIZONTAL YOL XETLERI
const houseHorizontalRoadGeo = new THREE.PlaneGeometry(hoodWidth, 2);
const houseHorizontalRoadMat = new THREE.MeshStandardMaterial({
    color: 0x8B5A2B, // torpaq rəngi
    roughness: 1
});
for (let r = 0; r < houseRows - 1; r++) {
    const z = (r * houseSpacingZ) + houseSpacingZ / 2;

    const hRoad = new THREE.Mesh(houseHorizontalRoadGeo, houseHorizontalRoadMat);
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.set(0, 0.012, z);
    scene.add(hRoad);
}
// 8-EV ERAZISININ VERTICAL YOL XETLERI
const houseVerticalRoadGeo = new THREE.PlaneGeometry(2, hoodDepth);
const houseVerticalRoadMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 1 });

for (let i = 0; i < housePerRow - 1; i++) {
    const x = (i * houseSpacingX) - ((housePerRow - 1) * houseSpacingX) / 2 + houseSpacingX / 2;

    const road = new THREE.Mesh(houseVerticalRoadGeo, houseVerticalRoadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.012, (houseRows * houseSpacingZ) / 2 - 3);
    scene.add(road);
}
// 9-BINA ERAZISININ YER SETHI
const cityWidth = buildingsPerRow * buildingSpacingX + 6;
const cityDepth = buildingRows * buildingSpacingZ + 6;

const cityGroundGeo = new THREE.PlaneGeometry(cityWidth, cityDepth);
const cityGroundMat = new THREE.MeshStandardMaterial({
    color: 0x555555,   // asfalt-boz
    roughness: 0.9
});
const cityGround = new THREE.Mesh(cityGroundGeo, cityGroundMat);
cityGround.rotation.x = -Math.PI / 2;
cityGround.position.set(0, 0.01, (buildingRows * buildingSpacingZ) / 2 - 30 - 3);
scene.add(cityGround);
// 10-BINA ERAZISININ HORIZONTAL YOL XETLERI
const buildingHorizontalRoadGeo = new THREE.PlaneGeometry(cityWidth, 2.6);
const buildingHorizontalRoadMat = new THREE.MeshStandardMaterial({
    color: 0x3a2f22, // torpaq rəngi
    roughness: 1
});
for (let r = 0; r < buildingRows - 1; r++) {
    const z = -30 + (r * buildingSpacingZ) + buildingSpacingZ / 2;

    const hRoad = new THREE.Mesh(buildingHorizontalRoadGeo, buildingHorizontalRoadMat);
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.set(0, 0.012, z);
    scene.add(hRoad);
}
// 11-BINA ERAZISININ VERTICAL YOL XETLERI
const buildingVerticalRoadGeo = new THREE.PlaneGeometry(2, cityDepth);
const buildingVerticalRoadMat = new THREE.MeshStandardMaterial({
    color: 0x3a2f22,
    roughness: 1
});

for (let i = 0; i < buildingsPerRow - 1; i++) {
    const x = (i * buildingSpacingX) - ((buildingsPerRow - 1) * buildingSpacingX) / 2 + buildingSpacingX / 2;

    const road = new THREE.Mesh(buildingVerticalRoadGeo, buildingVerticalRoadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.012, (buildingRows * buildingSpacingZ) / 2 - 30 - 3);
    scene.add(road);
}
// 12-UMUMI ERAZININ YER SETHI
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

function animate() {
    requestAnimationFrame(animate);

    if (controls) controls.update();
    renderer.render(scene, camera);
}
animate();