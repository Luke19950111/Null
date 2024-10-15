import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myThreeJsCanvas'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// 创建棋盘
const boardSize = 15;
const boardGeometry = new THREE.BoxGeometry(boardSize, 0.5, boardSize);
const boardMaterial = new THREE.MeshPhongMaterial({ color: 0xD2691E });
const board = new THREE.Mesh(boardGeometry, boardMaterial);
board.receiveShadow = true;
scene.add(board);

// 创建网格线
const gridHelper = new THREE.GridHelper(boardSize, 14, 0x000000, 0x000000);
gridHelper.position.y = 0.251;
scene.add(gridHelper);

// 创建棋子
const pieceGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

// 存储棋盘状态
const boardState = Array(15).fill().map(() => Array(15).fill(null));

// 当前玩家（true为白棋，false为黑棋）
let currentPlayer = true;

// 添加光源
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 处理鼠标点击
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(board);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const x = Math.round(intersect.point.x + boardSize / 2 - 0.5);
        const z = Math.round(intersect.point.z + boardSize / 2 - 0.5);

        if (x >= 0 && x < 15 && z >= 0 && z < 15 && !boardState[x][z]) {
            placePiece(x, z);
        }
    }
}

function placePiece(x, z) {
    const piece = new THREE.Mesh(pieceGeometry, currentPlayer ? whiteMaterial : blackMaterial);
    piece.position.set(x - boardSize / 2 + 0.5, 0.5, z - boardSize / 2 + 0.5);
    piece.castShadow = true;
    scene.add(piece);

    boardState[x][z] = currentPlayer;

    if (checkWin(x, z)) {
        alert((currentPlayer ? "白棋" : "黑棋") + "获胜！");
        resetGame();
    } else {
        currentPlayer = !currentPlayer;
    }
}

function checkWin(x, z) {
    const directions = [
        [1, 0], [0, 1], [1, 1], [1, -1]
    ];

    for (let [dx, dz] of directions) {
        let count = 1;
        count += countDirection(x, z, dx, dz);
        count += countDirection(x, z, -dx, -dz);
        if (count >= 5) return true;
    }
    return false;
}

function countDirection(x, z, dx, dz) {
    let count = 0;
    x += dx;
    z += dz;
    while (x >= 0 && x < 15 && z >= 0 && z < 15 && boardState[x][z] === currentPlayer) {
        count++;
        x += dx;
        z += dz;
    }
    return count;
}

function resetGame() {
    scene.children = scene.children.filter(child => child === board || child === gridHelper || child instanceof THREE.Light);
    boardState.forEach(row => row.fill(null));
    currentPlayer = true;
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 更新控制器
    renderer.render(scene, camera);
}

animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});