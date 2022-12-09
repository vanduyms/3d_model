import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from 'react';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


function Solider({ numAction, model }) {
  const loader = useLoader(GLTFLoader, "Soldier.glb");
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
      scale={1}
      position={[0, -1, 0]}
      receiveShadow
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={model} />
    </group>
  )
}

function Player({ model }) {
  return (
    <>
      <Solider model={model} numAction={0} />
    </>
  );
}

export default Player;
