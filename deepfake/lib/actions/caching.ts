"use server";

import { revalidateTag } from "next/cache";

export const revalidateUser = () => {
  revalidateTag(`user`);
};
