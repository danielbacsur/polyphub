import { Button } from "@/components/ui/button";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export const metadata: Metadata = {
  title: "Polyp HUB",
  description: "Discover our solutions for the Junction X Budapest hackathon",
};

export default function Home() {
  return (
    <>
      <div className="h-full flex flex-col lg:flex-row items-center pb-12 md:pb-0">
        <div className="flex-1 grid place-items-center">
          <Image
            className="w-auto"
            src="/logo.png"
            alt="Polyphub logo"
            width={300}
            height={300}
          />
        </div>
        <div className="flex-1 grid place-items-center">
          <div className="flex flex-col space-y-4 lg:space-y-8 text-center">
            <h1 className="text-2xl lg:text-3xl font-bold">Deepfake</h1>

            <p className="w-96">
              <Balancer>
                Ever watched a video and wondered if it&apos;s a celebrity or
                their digital twin speaking?
              </Balancer>
            </p>

            <Button asChild>
              <Link href="https://app.polyphub.hu/" >
                Start The Experience
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
