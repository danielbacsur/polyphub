import { User } from "@prisma/client";

export interface Session {
  user: User;
}
