import { useFrame, useGraph } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, type MutableRefObject } from "react";
import { type Euler } from "three";

interface AvatarProps {
  url: string;
  blendshapesRef: MutableRefObject<any[]>;
  rotation: Euler;
}

const Avatar: React.FC<AvatarProps> = ({ url, blendshapesRef, rotation }) => {
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);
  const headMeshRef = useRef<any[]>([]);

  useEffect(() => {
    if (nodes.Wolf3D_Head) headMeshRef.current.push(nodes.Wolf3D_Head);
    if (nodes.Wolf3D_Teeth) headMeshRef.current.push(nodes.Wolf3D_Teeth);
    if (nodes.Wolf3D_Beard) headMeshRef.current.push(nodes.Wolf3D_Beard);
    if (nodes.Wolf3D_Avatar) headMeshRef.current.push(nodes.Wolf3D_Avatar);
    if (nodes.Wolf3D_Head_Custom)
      headMeshRef.current.push(nodes.Wolf3D_Head_Custom);
  }, [nodes]);

  useFrame(() => {
    if (blendshapesRef.current.length > 0) {
      blendshapesRef.current.forEach((element) => {
        headMeshRef.current.forEach((mesh) => {
          const index = mesh.morphTargetDictionary[element.categoryName];
          if (index !== undefined && index >= 0) {
            mesh.morphTargetInfluences[index] = element.score;
          }
        });
      });

      nodes.Head.rotation.set(rotation.x, rotation.y, rotation.z);
      nodes.Neck.rotation.set(
        rotation.x / 5 + 0.3,
        rotation.y / 5,
        rotation.z / 5,
      );
      nodes.Spine2.rotation.set(
        rotation.x / 10,
        rotation.y / 10,
        rotation.z / 10,
      );
    }
  });

  return <primitive object={scene} position={[0, -1.71, 0]} />;
};

export default Avatar;
