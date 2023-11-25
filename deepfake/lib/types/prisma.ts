import {
  type Metadata,
  type Tag,
  type Validation as LonelyValidation,
} from "@prisma/client";

export type Validation = LonelyValidation & {
  tags: Tag[];
  metadata: Metadata | null;
};
