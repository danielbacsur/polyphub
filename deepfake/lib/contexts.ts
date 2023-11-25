import { type EValidation } from "./types/prisma";
import { type User, type Tag } from "@prisma/client";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);

export const ValidationContext = createContext<EValidation | null>(null);
export const ValidationsContext = createContext<EValidation[] | null>(null);

export const TagContext = createContext<Tag | null>(null);
