import { type Validation, type User, type Tag } from "@prisma/client";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);

export const ValidationContext = createContext<Validation | null>(null);

export const TagContext = createContext<Tag | null>(null);
