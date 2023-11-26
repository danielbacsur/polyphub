"use client";

import { createValidation, submitValidation } from "@/lib/actions/validation";
import { useRef, type FormEvent } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { LoadingDots } from "./loading-dots";
import { Button } from "./ui/button";

// export function UploadForm() {
// const inputFileRef = useRef<HTMLInputElement>(null);

// const router = useRouter();
// const user = useUser();

// const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//   event.preventDefault();

//   if (!inputFileRef.current?.files) {
//     toast.error("You need to upload a file");
//     return;
//   }

//   const file = inputFileRef.current.files[0];

//   toast.loading("Uploading video");

//   const { url } = await upload(file.name, file, {
//     access: "public",
//     handleUploadUrl: "/api/upload",
//   });

//   toast.loading("Creating validation");

//   const validation = await createValidation(user, url);

//   toast.loading("Getting your results");

//   const success = await submitValidation(validation);

//   if (!success) {
//     toast.error("Something went wrong");
//     return;
//   }

//   router.push("/overview");
// };

//   return (
//     <form onSubmit={onSubmit}>
//       <input name="file" ref={inputFileRef} type="file" required />
//       <button type="submit">Upload</button>
//     </form>
//   );
// }

export function UploadForm() {
  const [data, setData] = useState<{
    image: string | null;
  }>({
    image: null,
  });

  const router = useRouter();
  const user = useUser();

  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const onSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!file) {
      toast.error("You need to upload a file");
      return;
    }

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

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData],
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    return !data.image || saving;
  }, [data.image, saving]);

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="w-[28vw]">
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              const file = e.dataTransfer.files && e.dataTransfer.files[0];
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error("File size too big (max 50MB)");
                } else {
                  setFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setData((prev) => ({
                      ...prev,
                      image: e.target?.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              data.image
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <h2 className="text-xl pt-2 font-semibold">Upload a file</h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {file && (
            <p className="mt-2 text-center text-sm text-gray-500">
              Successfully selected {file.name}
            </p>
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      <Button disabled={saveDisabled} type="submit">
        {saveDisabled ? (
          <p>Select a video to get started</p>
        ) : (
          <p>Upload video</p>
        )}
      </Button>

    </form>
  );
}
