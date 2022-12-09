import './App.css';
import * as THREE from "three";
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
