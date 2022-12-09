import { useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";
import grass from "../assets/grass.png";

function Ground(props) {
  const texture = useTexture(grass);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return (
    <mesh {...props} receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="green" />
    </mesh>
  )
};

export default Ground;