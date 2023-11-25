"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getValidation } from "@/lib/fetchers/validation";
import { useValidation } from "@/lib/hooks/use-validation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OverviewPage() {
  const { validation, setValidation } = useValidation();

  const update = async () => {
    toast.info("Updating validation...");

    const response = await getValidation(validation.id);

    setValidation(response);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      update();

      if (validation.status === 'completed') {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [validation]);

  return <>{validation.id} - {validation.status}</>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow pl-[calc(25vw_+_1rem)] pr-[calc(10vw_+_1rem)] pt-4 -mb-4">
        <div className="bg-pink-500 w-full h-full rounded-lg overflow-hidden">
          {/* <video className="h-max-full rounded-lg" src={validation.video} controls /> */}
        </div>
      </div>
      {/* <div className="p-4">
        <Table>
          <TableCaption>
            These are the tags that were detected in your video.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25vw]">Types</TableHead>
              <TableHead />
              <TableHead className="w-[10vw] text-right">Count</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {validation.tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="w-[25vw] font-medium">
                  {tag.type}
                </TableCell>
                <TableCell className="px-0 relative border-x">
                  {tag.times.map((time) => {
                    const left = `${
                      (time / (validation.metadata?.duration)) *
                      100
                    }%`;

                    return (
                      <div
                        key={time}
                        className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
                        style={{ left }}
                      />
                    );
                  })}
                </TableCell>
                <TableCell className="w-[10vw] text-right">
                  {tag.count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
}
