// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 4);
function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;
  if (water.material && water.material.uniforms && water.material.uniforms['time']) {
    water.material.uniforms['time'].value = t;
  }
  controls.update();
  renderer.render(scene, camera);
}


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Water geometry (big plane)
const waterGeometry = new THREE.PlaneGeometry(1000, 1000);

// Water object
const water = new Water(waterGeometry, {
  color: '#1e90ff',
  scale: 4,
  flowDirection: new THREE.Vector2(1, 1),
  textureWidth: 1024,
  textureHeight: 1024
});

// Rotate to be horizontal and position under model
water.rotation.x = -Math.PI / 2;
water.position.y = -0.5;

scene.add(water);


// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Load GLB model
const loader = new THREE.GLTFLoader();
loader.load(
  'finished_assembly.glb',
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    loader.load(
  'finished_assembly.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Compute model bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    // Reposition camera to fit the whole model
    const fitOffset = 1.5; // increase if you want more space around
    const distance = size * fitOffset;

    // Move camera back on Z and slightly up
    camera.position.copy(center);
    camera.position.x += distance;
    camera.position.y += distance * 0.4;
    camera.position.z += distance;

    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();

    // Make controls orbit around model center
    controls.target.copy(center);
    controls.update();
  },
  undefined,
  (error) => console.error('Error loading GLB:', error)
);


    // Optional: center model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); // move pivot to center
  },
  undefined,
  (error) => {
    console.error('Error loading GLB:', error);
  }
);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
