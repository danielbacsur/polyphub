export type RawValidation = {
  error?: string;
  blinks_info: string;
  frame_count: number;
  frame_rate: number;
  tags: {
    id: number;
    type: string;
    count: number;
    times: number[];
  }[];
};

export type NewValidation = {
  url: string;
  blinkInfo: string;
  frameCount: number;
  frameRate: number;
};

export type NewTags = {
  type: string;
  count: number;
  times: number[];
}[];
