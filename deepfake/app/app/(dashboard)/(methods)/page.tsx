import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import Balancer from "react-wrap-balancer";
import Link from "next/link";

export default async function WorkspacesPage() {
  return (
    <div className="h-full flex">
      <div className="flex-1 hidden lg:grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <UploadForm />
        </div>
      </div>

      <div className="flex-1 grid place-items-center p-12">
        <div className="flex flex-col space-y-4 lg:space-y-8 text-center">
          <h1 className="text-2xl lg:text-3xl font-bold">Deepfake</h1>

          <Balancer className="max-w-lg">
            On mobile, use our exclusive head movement authentication for
            deepfake detection. On desktop, upload and analyze videos for
            deepfake checking. Secure your digital identity seamlessly with
            Polyp HUB, regardless of your device!
          </Balancer>

          <Button asChild>
            <Link href="/interview">Try Our Method</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
