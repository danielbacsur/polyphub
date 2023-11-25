import { type Validation } from "./types/prisma";
import { type User, type Tag } from "@prisma/client";
import { createContext } from "react";

export type UserContextType = User;

export const UserContext = createContext<UserContextType | null>(null);

export type ValidationContextType = {
  validation: Validation;
  validations: Validation[];
  setValidation: (validation: Validation) => void;
};

export const ValidationContext = createContext<ValidationContextType | null>(
  null
);
