"use client";

import { createValidation } from "@/lib/actions/prisma";
import { getUser } from "@/lib/fetchers";
import { useUser } from "@/lib/hooks/use-user";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, type FormEvent } from "react";
import { toast } from "sonner";

export function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const user = useUser();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    const { url } = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    toast.loading(url);

    const validation = await createValidation(user, url)

    console.log(validation) 

    const callback = createCallback(validation.id);

    const response = await fetch("/api/validation/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        callback
      }),
    }).then((res) => res.json());

    // toast.success(JSON.stringify(validation));

    // router.push("/overview");
  };

  const createCallback = (id: string) => {
    return process.env.NODE_ENV === "development"
      ? `http://${process.env.NEXT_PUBLIC_TEST_DOMAIN}/api/validation/${id}/finalize`
      : `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/validation/${id}/finalize`;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}
