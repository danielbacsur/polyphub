"use client";

import {
  POINTS,
  eulerToDirectionVector,
  roundAngle,
} from "@/lib/utils/interview";
import { type Point } from "@/lib/types/interview";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";

export function ClockComponent({ rotation }: { rotation: THREE.Euler }) {
  const router = useRouter();

  const [points, setPoints] = useState<Point[]>(() =>
    [...Array(POINTS)].map((_, i) => ({
      id: (i * 360) / POINTS,
      x: 0,
      y: 0,
      status: false,
    }))
  );

  useEffect(() => {
    const radius = window.innerWidth * 0.4;

    setPoints(
      points.map((p, i) => {
        const angle = (2 * Math.PI * i) / POINTS;
        const x = radius * Math.cos(angle);
        const y = -radius * Math.sin(angle);
        return { ...p, x, y };
      })
    );
  }, []);

  useEffect(() => {
    if (points.every((p) => p.status)) {
      router.push("https://polyphub.hu/");
    }
  }, [points]);

  useEffect(() => {
    const vector3 = eulerToDirectionVector(rotation);

    const vector2 = new THREE.Vector2(vector3.x, vector3.y);

    const rounded = roundAngle(vector2.angle() * (180 / Math.PI));

    if (0.4 < vector2.length()) {
      setPoints((points) =>
        points.map((point) => {
          if (point.id === rounded) {
            return { ...point, status: true };
          }
          return point;
        })
      );
    }
  }, [rotation]);

  return (
    <div className="absolute h-full w-full grid place-items-center">
      <div className="relative">
        {points.map((point, i) => (
          <div
            key={i}
            className={
              "w-10 h-10  rounded-full absolute grid place-items-center" +
              (point.status ? " bg-green-500" : " bg-gray-500")
            }
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {point.id}
          </div>
        ))}
      </div>
    </div>
  );
}
