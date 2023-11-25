import { SelectionButton } from "@/components/selection-button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="h-full flex flex-col lg:flex-row items-center pt-12 md:pt-0">
        <div className="flex-1 grid place-items-center">
          <SelectionButton
            title="Deepfake"
            description="Ever watched a video and wondered if it's a celebrity or their digital twin speaking?"
            buttonHref="https://app.deepfake.polyphub.hu/"
            buttonText="Check if you are a Deepfake"
          />
        </div>
        <div className="flex-none grid place-items-center order-first lg:order-none">
          <Image
            className="w-48 lg:w-auto"
            src="/logo.png"
            alt="Polyphub logo"
            width={300}
            height={300}
          />
        </div>
        <div className="flex-1 grid place-items-center">
          <SelectionButton
            title="Radiotherapy"
            description="Imagine a world where radiotherapy appointments are as easy to schedule as your favorite TV show."
            buttonHref="https://app.radiotherapy.polyphub.hu/"
            buttonText="Discover Our 3D Hospital"
          />
        </div>
      </div>
    </>
  );
}
