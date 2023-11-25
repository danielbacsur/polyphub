"use client";

import { createValidation, submitValidation } from "@/lib/actions/validation";
import { useRef, type FormEvent } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const user = useUser();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      toast.error("You need to upload a file");
      return;
    }

    const file = inputFileRef.current.files[0];

    toast.loading("Uploading video");

    const { url } = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    toast.loading("Creating validation");

    const validation = await createValidation(user, url);

    toast.loading("Getting your results");

    const success = await submitValidation(validation);

    if (!success) {
      toast.error("Something went wrong");
      return;
    }

    router.push("/overview");
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="file" ref={inputFileRef} type="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}
