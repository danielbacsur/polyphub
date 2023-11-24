import { type User } from "@prisma/client";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);
