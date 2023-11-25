"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, type FormEvent } from "react";
import { toast } from "sonner";

export function UploadForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

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

    const validation = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
      }),
    }).then((res) => res.json());

    toast.success(JSON.stringify(validation));

    router.push("/overview");
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="file" ref={inputFileRef} type="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}
