// Colors
// yellow #FDC800 
// pink #FF4197
// dark blue #032B44
// green #04D89D

import { AxesHelper, BufferGeometry, Float32BufferAttribute, MathUtils, PerspectiveCamera, Points, PointsMaterial, Scene, TextureLoader, WebGLRenderer, VertexColors, Group, Clock, SphereGeometry, Mesh, MeshNormalMaterial, BoxGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './style.css';

const scene = new Scene;
scene.add(new AxesHelper());

const textureLoader = new TextureLoader();
const lightningTexture = textureLoader.load('/lightning.png');
const alphaMapLightning = textureLoader.load('/lightning_alphaMap.png');


// Camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 2000;
const camera = new PerspectiveCamera(fov, aspect, near, far);

camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);


// Points on a box

// const cubeGeometry = new BoxGeometry(1, 1, 1);
// const pointMaterial = new PointsMaterial({
//   color: 0xff016b,
//   size: 0.25,
// });
// const cornerPoints = new Points(cubeGeometry, pointMaterial);
// scene.add(cornerPoints);


// Points on space
const count = 500;
const distance = 2;
const points = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i=0; i < points.length; i++){
  points[i] = MathUtils.randFloatSpread(distance * 3);
  colors[i] = Math.random();
}

const geometry = new BufferGeometry();
geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
const pointsMaterial = new PointsMaterial({
  size: 0.08,
  vertexColors: VertexColors,
  // map: lightningTexture,
  alphaTest: 0.01,
  alphaMap: alphaMapLightning,
  transparent: true
});

const pointsObject = new Points(geometry, pointsMaterial);
const lightningsGroup = new Group();
lightningsGroup.add(pointsObject);
scene.add(lightningsGroup);

// 3D object imported
const loader = new GLTFLoader();
loader.load('/Lightning3D.gltf', (gltfScene) => {
  let object = gltfScene.scene;
  scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (err) => {
    console.error(err);
  }
);

// Renderer
const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearAlpha(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const clock = new Clock();

function tick(){
  const time = clock.getElapsedTime();
  lightningsGroup.rotation.y = time * 0.01;
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(tick);
}

tick();


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})