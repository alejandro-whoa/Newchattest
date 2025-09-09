// public/js/webgl-visualizer.js
let scene, camera, renderer;
let particles;

function initWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background for blending with CSS

    // Particles
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        // Positions
        positions.push(Math.random() * 200 - 100); // x
        positions.push(Math.random() * 200 - 100); // y
        positions.push(Math.random() * 200 - 100); // z

        // Colors (subtle blues/purples)
        color.setHSL(0.6 + 0.1 * Math.random(), 0.8, 0.5 + 0.2 * Math.random());
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending // For a glowing effect
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 50;

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animateWebGL() {
    requestAnimationFrame(animateWebGL);

    // Rotate particles subtly
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// Enhanced particle animation with mouse interaction
let mouseX = 0, mouseY = 0;

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Subtle camera movement based on mouse position
    if (camera) {
        camera.position.x = mouseX * 5;
        camera.position.y = mouseY * 5;
    }
}

window.addEventListener('mousemove', onMouseMove, false);

// Ensure Three.js is loaded before calling init
if (typeof THREE !== 'undefined') {
    initWebGL();
    animateWebGL();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof THREE !== 'undefined') {
            initWebGL();
            animateWebGL();
        } else {
            console.error("Three.js not loaded. WebGL background will not function.");
        }
    });
}