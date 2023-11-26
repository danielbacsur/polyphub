"use client";

import * as THREE from "three";

export const POINTS = 24;

export function roundAngle(angle: number): number {
  // Normalize the angle to be within 0 to 360 degrees
  angle = angle % 360;
  if (angle < 0) {
    angle += 360;
  }

  // Find the nearest multiple of 30
  const remainder = angle % (360 / POINTS);
  if (remainder < 360 / POINTS / 2) {
    // Round down
    return angle - remainder;
  } else {
    // Round up
    const roundedUp = angle + (360 / POINTS - remainder);
    // Handle the case where rounding up results in 360 degrees
    return roundedUp === 360 ? 0 : roundedUp;
  }
}

export function eulerToDirectionVector(euler: THREE.Euler) {
  // Create a unit vector pointing in the default direction (along Z-axis)
  const direction = new THREE.Vector3(0, 0, 1);

  // Create a rotation matrix from the Euler angles
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationFromEuler(euler);

  // Apply the rotations to the direction vector
  direction.applyMatrix4(rotationMatrix);

  return direction;
}

export const model =
  "https://models.readyplayer.me/6460d95f9ae10f45bffb2864.glb?morphTargets=ARKit&textureAtlas=1024";
