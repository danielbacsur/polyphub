import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function WorkspacesPage() {
  return (
    <div className="h-full flex">
      <div className="flex-1 hidden lg:grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <h1>Upload Your Files</h1>
          <UploadForm />
        </div>
      </div>
      <div className="flex-1 grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <h1>Discover Our Method</h1>

          <Link href="/record">
            <Button>Try It Out</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
