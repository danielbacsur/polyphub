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

export default function OverviewPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow pl-[calc(25vw_+_1rem)] pr-[calc(10vw_+_1rem)] pt-4 -mb-4">
        <div className="bg-pink-500 w-full h-full rounded-lg">
          {/* <video
           
            className="h-max-full rounded-lg"
            src={validation.video}
            controls
          /> */}
        </div>
      </div>
      <div className="p-4">
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
            {res.tags.slice(0, 4).map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="w-[25vw] font-medium">
                  {tag.type}
                </TableCell>
                <TableCell className="px-0 relative border-x">
                  {tag.frames.map((frame) => {
                    const left = `${(frame / duration) * 100}%`;

                    return (
                      <div
                        key={frame}
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
      </div>
    </div>
  );
}

const duration = 15.3;
const res = {
  blinks_info: "nominal",
  frame_count: 460,
  frame_rate: 30.0,
  tags: [
    {
      count: 4,
      frames: [4.966666666666667, 5.0, 5.3, 5.333333333333333],
      id: 0,
      type: "frame_inconsistencies",
    },
    {
      count: 12,
      frames: [
        5.0, 5.033333333333333, 5.066666666666666, 5.1, 5.133333333333334,
        5.166666666666667, 5.2, 5.233333333333333, 5.266666666666667, 5.3,
        5.333333333333333, 6.333333333333333,
      ],
      id: 1,
      type: "face_inconsistencies",
    },
    {
      count: 7,
      frames: [
        4.933333333333334, 4.966666666666667, 5.0, 5.033333333333333,
        5.266666666666667, 5.3, 5.333333333333333,
      ],
      id: 2,
      type: "brightness_contrast_inconsistencies",
    },
    {
      count: 4,
      frames: [4.966666666666667, 5.0, 5.3, 5.333333333333333],
      id: 0,
      type: "frame_inconsistencies",
    },
    {
      count: 12,
      frames: [
        5.0, 5.033333333333333, 5.066666666666666, 5.1, 5.133333333333334,
        5.166666666666667, 5.2, 5.233333333333333, 5.266666666666667, 5.3,
        5.333333333333333, 6.333333333333333,
      ],
      id: 1,
      type: "face_inconsistencies",
    },
    {
      count: 7,
      frames: [
        4.933333333333334, 4.966666666666667, 5.0, 5.033333333333333,
        5.266666666666667, 5.3, 5.333333333333333,
      ],
      id: 2,
      type: "brightness_contrast_inconsistencies",
    },
    {
      count: 21,
      frames: [
        6.4, 7.4, 7.733333333333333, 7.966666666666667, 8.233333333333333,
        8.433333333333334, 9.266666666666667, 9.5, 9.7, 9.866666666666667, 10.1,
        10.3, 10.5, 10.766666666666667, 11.133333333333333, 11.366666666666667,
        11.7, 12.033333333333333, 12.3, 12.8, 13.1,
      ],
      id: 3,
      type: "blinks",
    },
  ],
};
