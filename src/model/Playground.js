/* eslint-disable react-hooks/exhaustive-deps */
import * as THREE from "three";
import { OrbitControls, Sky } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Player from "./Player";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import update from "../CharacterControls";

const orbitControl = new THREE.Vector3(0, 0, 0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const clock = new THREE.Clock();

export default function Playground() {
  const loader = useLoader(GLTFLoader, "Soldier.glb");
  const model = loader.scene;
  camera.position.x = 0;
  camera.position.y = 10;
  camera.position.z = 20;
  const keyPress = {}

  document.addEventListener("keydown", (event) => {
    const delta = clock.getDelta();
    keyPress[event.key.toLowerCase()] = true;
    update(model, camera, orbitControl, delta, keyPress);
  }, false);

  document.addEventListener("keyup", (event) => {
    keyPress[event.key.toLowerCase()] = false;
  }, false);
  // const cam = new THREE.PerspectiveCamera({ fov: 90, near: 0.1, far: 1000, position: camera });
  // update(model, camera)

  return (
    <Canvas
      shadows
      camera={camera}
    >
      <OrbitControls
        makeDefault
        enableDamping
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={5}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={orbitControl}
      />
      <ambientLight intensity={1} />
      <Sky
        distance={4500}
        sunPosition={[0, 1, 1]}
        inclination={0}
        azimuth={0.25}
      />
      <Suspense fallback={null}>
        {/* <Ground rotation={[-Math.PI / 2, 0, 0]} /> */}
        {console.log(orbitControl)}
        <Player model={model} />
      </Suspense>
    </Canvas>
  )
}