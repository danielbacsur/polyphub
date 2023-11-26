"use client";

import {
  FaceLandmarker,
  FaceLandmarkerOptions,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { ClockComponent } from "@/components/interview-clock";
import { VideoRecorder } from "@/components/video-recorder";
import { useEffect, useRef, useState } from "react";
import { model } from "@/lib/utils/interview";
import { Canvas } from "@react-three/fiber";
import Avatar from "@/components/avatar";
import * as THREE from "three";

const options: FaceLandmarkerOptions = {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    delegate: "GPU",
  },
  numFaces: 1,
  runningMode: "VIDEO",
  outputFaceBlendshapes: true,
  outputFacialTransformationMatrixes: true,
};

export default function InterviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker>();
  const blendshapesRef = useRef<any[]>([]);
  const lastVideoTimeRef = useRef<number>(-1);
  const [rotation, setRotation] = useState<THREE.Euler>(new THREE.Euler());

  const setup = async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
      filesetResolver,
      options
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", predict);
    }
  };

  const predict = async () => {
    if (
      videoRef.current &&
      lastVideoTimeRef.current !== videoRef.current.currentTime
    ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      const faceLandmarkerResult = faceLandmarkerRef.current?.detectForVideo(
        videoRef.current,
        Date.now()
      );

      if (
        faceLandmarkerResult &&
        faceLandmarkerResult.faceBlendshapes &&
        faceLandmarkerResult.faceBlendshapes.length > 0 &&
        faceLandmarkerResult.faceBlendshapes[0].categories
      ) {
        blendshapesRef.current =
          faceLandmarkerResult.faceBlendshapes[0].categories;

        const matrix = new THREE.Matrix4().fromArray(
          faceLandmarkerResult.facialTransformationMatrixes![0].data
        );

        setRotation(new THREE.Euler().setFromRotationMatrix(matrix));
      }
    }

    window.requestAnimationFrame(predict);
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <>
      <VideoRecorder videoRef={videoRef} />

      <ClockComponent rotation={rotation} />

      <div className="h-full grid place-items-center">
        <div className="w-[60vw] h-[60vw] rounded-full overflow-hidden">
          <Canvas
            style={{ position: "relative" }}
            camera={{ fov: 25, position: [0, -0.1, 1.2] }}
            shadows
          >
            <ambientLight intensity={0.6} />
            <pointLight
              position={[10, 10, 10]}
              color={new THREE.Color(1, 1, 0)}
              intensity={120}
              castShadow
            />
            <pointLight
              position={[-10, 0, 10]}
              color={new THREE.Color(1, 0, 0)}
              intensity={160}
              castShadow
            />
            <pointLight position={[0, 0, 10]} intensity={60} castShadow />
            <Avatar
              url={model}
              blendshapesRef={blendshapesRef}
              rotation={rotation}
            />
          </Canvas>
        </div>
      </div>
    </>
  );
}
