import { UploadForm } from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { prisma } from "@/lib/clients/prisma";
import { getUser } from "@/lib/fetchers";

export default async function WorkspacesPage() {
  const user = await getUser();

  const validations = await prisma.validation.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
  });
  return (
    <div className="h-full flex">
      <div className="flex-1 grid place-items-center">
        <div className="flex flex-col items-center space-y-4">
          <h1>Intuitech&apos;s Method</h1>
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
