import { RefObject } from "react";

export function VideoRecorder({
  videoRef,
}: {
  videoRef: RefObject<HTMLVideoElement>;
}) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-white -z-[998]" />
      <video
        className="absolute w-full h-auto -z-[999]"
        ref={videoRef}
        loop
        muted
        autoPlay
        playsInline
      />
    </>
  );
}
