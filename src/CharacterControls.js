import * as THREE from "three";
import { A, S, D, W, DIRECTIONS } from "./keys";

const walkDirection = new THREE.Vector3();
const rotateAngle = new THREE.Vector3(0, 1, 0);
const rotateQuaternion = new THREE.Quaternion();
const cameraTarget = new THREE.Vector3();

// const runVelocity = 5;
const walkVelocity = 2;

function getDirectionOffset(keyPressed) {
  var directionOffset = 0;
  if (keyPressed[W]) {
    if (keyPressed[A]) {
      directionOffset = Math.PI / 4;
    } else if (keyPressed[D]) {
      directionOffset = -Math.PI / 4;
    }
  } else if (keyPressed[S]) {
    if (keyPressed[A]) {
      directionOffset = Math.PI / 4 + Math.PI / 2;
    } else if (keyPressed[D]) {
      directionOffset = -Math.PI / 4 - Math.PI / 2;
    } else {
      directionOffset = Math.PI;
    }
  } else if (keyPressed[A]) {
    directionOffset = Math.PI / 2;
  } else if (keyPressed[D]) {
    directionOffset = -Math.PI / 2;
  }

  return directionOffset;
}

function updateCameraTarget(model, camera, orbitControls, moveX, moveZ) {
  camera.x += moveX;
  camera.z += moveZ;

  cameraTarget.x = model.position.x;
  cameraTarget.y = model.position.y + 1;
  cameraTarget.z = model.position.z;

  orbitControls = cameraTarget;
}

function update(model, camera, orbitControls, delta, keyPress) {
  console.log("Updating");
  // const directionPressed = DIRECTIONS.some(key => keyPress[key] == true);
  // if (directionPressed) numAction = 0;
  // else numAction = 3;

  var angleYCameraDirection = Math.atan2(
    (camera.position.x - model.position.x),
    (camera.position.z - model.position.z)
  );
  var directionOffset = getDirectionOffset(keyPress);

  rotateQuaternion.setFromAxisAngle(rotateAngle, angleYCameraDirection + directionOffset);
  model.quaternion.rotateTowards(rotateQuaternion, 0.2);

  camera.getWorldDirection(walkDirection);
  walkDirection.y = 0;
  walkDirection.normalize();
  walkDirection.applyAxisAngle(rotateAngle, directionOffset);

  const moveX = walkDirection.x * walkVelocity * delta;
  const moveZ = walkDirection.z * walkVelocity * delta;

  model.position.x += moveX;
  model.position.z += moveZ;

  updateCameraTarget(model, camera, orbitControls, moveX, moveZ);
}

export default update;
