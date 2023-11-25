import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-full flex items-center">
        <div className="flex-1 grid place-items-center">
          <SelectionButton
            title="Deepfake"
            description="Lorem Ipsum Donol asdfl"
            buttonHref="https://app.deepfake.polyphub.hu/"
            buttonText="Check if you are a Deepfake"
          />
        </div>
        <div className="flex-none grid place-items-center">
          <Image src="/logo.png" alt="Polyphub logo" width={300} height={300} />
        </div>
        <div className="flex-1 grid place-items-center">
          <SelectionButton
            title="Radiotherapy"
            description="Lorem Ipsum Donol asdfasdfasdfl"
            buttonHref="https://app.radiotherapy.polyphub.hu/"
            buttonText="Discover Our 3D Hospital"
          />
        </div>
      </div>
    </>
  );
}

export function SelectionButton({
  title,
  description,
  buttonText,
  buttonHref,
  className,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col space-y-4 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-lg">{description}</p>
      <Link href={buttonHref}>
        <Button>{buttonText}</Button>
      </Link>
    </div>
  );
}
