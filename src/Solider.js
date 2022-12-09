import './App.css';
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { OrbitControls, PresentationControls } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const name = (type) => `img_${type}.jpg`;

const Model = () => {
  const [
    colorMap,
    displacementMap,
    normalMap,
    roughnessMap,
    aoMap,
  ] = useLoader(TextureLoader, [
    name("Color"),
    name("Displacement"),
    name("Normal"),
    name("Roughness"),
    name("AmbientOcclussion"),
  ]);

  const ref = useRef();
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    ref.current.rotation.y = Math.cos(a / 2);
    ref.current.rotation.x = Math.cos(a / 4);
  });
  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        displacementScale={0.2}
        map={colorMap}
        displacementMap={displacementMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
      />
    </mesh>
  )
}

function IronMan() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = 0.2;
    ref.current.rotation.y = Math.cos(t / 8);
  })

  const materials = useLoader(MTLLoader, "IronMan.mtl");
  const obj = useLoader(OBJLoader, "IronMan.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return (
    <>
      <PresentationControls
        global
        snap={{ mass: 75, tension: 1500 }}
        rotation={[0.3, 0.5, 0]}
      >
        <group ref={ref} scale={0.025} position={[0, -3, 0]}>
          <primitive object={obj} />
        </group>
      </PresentationControls>
    </>
  )
}

function Solider(props) {
  const numAction = props.numAction;

  const loader = useLoader(GLTFLoader, "Soldier.glb");
  const model = loader.scene;
  const animations = loader.animations;

  const ref = useRef();

  const mixer = new THREE.AnimationMixer(model);
  const walkAction = mixer.clipAction(animations[3], ref.current);
  const tPoseAction = mixer.clipAction(animations[2], ref.current);
  const runAction = mixer.clipAction(animations[1], ref.current);
  const idleAction = mixer.clipAction(animations[0], ref.current);
  const actions = [walkAction, runAction, idleAction, tPoseAction];

  useFrame((state, delta) => {
    // const mouse = state.mouse;

    // const x = (mouse.x * viewport.width) / 2;
    // const y = (mouse.x * viewport.height) / 2;

    // ref.current.position.set(x, y, 0);
    // ref.current.rotation.set(x, y, 0);
    actions[numAction].play();
    mixer.update(delta);
  })
  return (
    <group
      ref={ref}
      scale={2.5}
      {...props}
      receiveShadow
      rotation={[Math.PI / 10, Math.PI, 0]}
    >
      <primitive object={model} />
    </group>
  )
}

function App() {
  const [numAction, setNumAction] = useState(0);

  return (
    <div className="App">
      <Canvas className='canvas' shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight castShadow color={'white'} intensity={0.5} position={[0, 10, 10]} />
          <Solider numAction={numAction} position={[0, -2, 0]} />
        </Suspense>
        {/* <OrbitControls /> */}
      </Canvas>

      <div className='btn-container'>
        <button onClick={() => {
          setNumAction(0)
        }}> WALK </button>
        <button onClick={() => {
          setNumAction(1)
        }}>RUN</button>
        <button onClick={() => {
          setNumAction(2)
        }}>IDLE</button>
        <button onClick={() => {
          setNumAction(3)
        }}>NONE</button>
        {/* <button onClick={() => {
          setNumAction(3)
        }}>NONE</button> */}
      </div>
    </div>
  );
}

export default App;
