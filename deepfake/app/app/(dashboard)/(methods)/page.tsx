import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function WorkspacesPage() {
  return (
    <div className="h-full flex">
      <div className="flex-1 hidden lg:grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <UploadForm />
        </div>
      </div>
      <div className="flex-1 grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <Link href="/record">
            <Button size="lg">TRY OUT OUR METHOD</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
