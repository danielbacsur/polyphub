import { type Tag, type Validation } from "@prisma/client";

export type EValidation = Validation & { tags: Tag[] };