"use client";

import { useValidation } from "@/lib/hooks/use-validation";
import { getValidation } from "@/lib/fetchers/validation";
import { type Validation } from "@/lib/types/prisma";
import * as Table from "@/components/ui/table";
import { useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";

export default function OverviewPage() {
  const { validation, setValidation } = useValidation();

  const interval = useRef<NodeJS.Timeout | null>(null);

  const update = async () => {
    const response = await getValidation(validation.id);

    setValidation(response);
  };

  useEffect(() => {
    track("overview-started");

    interval.current = setInterval(() => {
      update();
    }, 4000);

    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (validation?.status === "complete" && interval.current) {
      track("overview-finished");

      clearInterval(interval.current);
    }
  }, [validation]);

  return (
    <>
      <div className="grid lg:hidden h-full place-items-center">
        Sorry you screen is too small.
      </div>

      <div className="absolute top-0 left-0">
        <Image
          className="w-auto"
          src="/logo.png"
          alt="Polyphub logo"
          width={120}
          height={120}
        />
      </div>

      <div className="hidden lg:flex h-full flex-col">
        <div className="flex-grow flex p-4 -mb-4 space-x-4">
          <div className="flex-none h-full w-[calc(40vw_-_1rem)] rounded-lg flex flex-col justify-between">
            <div className="w-full grid flex-grow place-items-center">
              <div className="w-full flex flex-col items-center space-y-4">
                <h1 className="text-3xl font-bold">Probability</h1>

                <Progress
                  value={(validation.metadata?.probability || 0) * 100}
                  className="w-[60%] h-4"
                />

                <h1 className="text-3xl font-bold">{`${(
                  (validation.metadata?.probability || 0) * 100
                ).toFixed()} %`}</h1>
              </div>
            </div>
            <Button asChild>
              <Link href="https://app.polyphub.hu/">Go Back</Link>
            </Button>
          </div>
          <div className="flex-grow bg-black w-full h-full rounded-lg relative overflow-hidden">
            <video
              className="absolute bottom-0 min-h-full min-w-full"
              loop
              muted
              autoPlay
              controls
              src={validation.url}
            />
          </div>
        </div>
        <div className="p-4">
          <Table.Table>
            <Table.TableCaption>
              {validation.status === "complete" &&
                validation.tags.length === 0 &&
                "No tags were detected in your video."}
              {validation.status === "complete" &&
                validation.tags.length > 0 &&
                "These are the tags that were detected in your video."}
              {validation.status === "pending" &&
                "Your video is being processed."}
            </Table.TableCaption>
            <Table.TableHeader>
              <Table.TableRow>
                <Table.TableHead className="w-[30vw]">Types</Table.TableHead>
                <Table.TableHead className="w-[5vw] text-center">
                  Count
                </Table.TableHead>
                <Table.TableHead className="w-[5vw] text-center">
                  %
                </Table.TableHead>
                <Table.TableHead />
              </Table.TableRow>
            </Table.TableHeader>

            <Table.TableBody>
              {validation.tags.map((tag) => (
                <Table.TableRow key={tag.id}>
                  <Table.TableCell className="w-[30vw] font-medium">
                    {tag.type}
                  </Table.TableCell>

                  <Table.TableCell className="w-[5vw] text-center">
                    {tag.count}
                  </Table.TableCell>

                  <Table.TableCell className="w-[5vw] text-center">
                    {(
                      (tag.count / (validation.metadata?.length || 1)) *
                      100
                    ).toFixed(1)}
                  </Table.TableCell>
                  <Table.TableCell className="px-1 border-x">
                    <div className="bg-red-500 w-full h-0 relative">
                      {tag.times.map((time) => {
                        const left = getTimelinePercent(
                          time,
                          validation,
                          tag.times
                        );

                        return (
                          <div
                            key={time}
                            className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
                            style={{ left }}
                          />
                        );
                      })}
                    </div>
                  </Table.TableCell>
                </Table.TableRow>
              ))}
            </Table.TableBody>
          </Table.Table>
        </div>
      </div>
    </>
  );
}

function getTimelinePercent(
  time: number,
  validation: Validation,
  times: number[]
) {
  const a = validation.metadata?.duration;
  const b = times.reduce((max, time) => Math.max(max, time), 0);

  return `${(time / (a || b)) * 100}%`;
}
