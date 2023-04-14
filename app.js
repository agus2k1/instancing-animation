import './main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import sprite from './images/hands-sprite.png';
import vertexShader from './shaders/vertex.glsl';

export default class Sketch {
  constructor() {
    this.scene = new THREE.Scene();
    this.container = document.getElementById('container');
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.useLegacyLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.addInstances();
    // this.setupResize();
    // this.resize();
    this.render();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // image cover
    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    // optional - cover with quad
    const distance = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * distance));

    // if (w/h > 1)
    // if (this.width / this.height > 1) {
    //   this.plane.scale.x = this.camera.aspect;
    // } else {
    //   this.plane.scale.y = 1 / this.camera.aspect;
    // }

    this.camera.updateProjectionMatrix();
  }

  addInstances() {
    this.count = 1000;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      uniforms: {
        uTime: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        uSprite: { value: new THREE.TextureLoader().load(sprite) },
      },
      fragmentShader: fragment,
      vertexShader: vertexShader,
      side: THREE.DoubleSide,
      transparent: true,
      // wireframe: true,
    });
    this.geometry = new THREE.PlaneGeometry(0.2, 0.25, 1, 1);

    // Instance
    this.insGeometry = new THREE.InstancedBufferGeometry();

    // Instance copy
    THREE.BufferGeometry.prototype.copy.call(this.insGeometry, this.geometry);

    // Object properties
    this.object = new THREE.InstancedMesh(
      this.insGeometry,
      this.material,
      this.count
    );

    this.object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Add instances
    const dummy = new THREE.Object3D();
    let offset = new Float32Array(this.count);
    let speed = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      dummy.position.set(10 * (i / this.count - 0.5), 0, 0);

      dummy.updateMatrix();
      this.object.setMatrixAt(i, dummy.matrix);

      offset[i] = Math.random();
      speed[i] = 0.5 + 0.2 * Math.random();
    }

    this.object.instanceMatrix.needsUpdate = true;
    this.object.computeBoundingSphere();

    // Attributes
    this.insGeometry.setAttribute(
      'aOffset',
      new THREE.InstancedBufferAttribute(offset, 1)
    );
    this.insGeometry.setAttribute(
      'aSpeed',
      new THREE.InstancedBufferAttribute(speed, 1)
    );

    this.scene.add(this.object);
  }

  render() {
    this.time += 0.05;
    this.material.uniforms.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch();
