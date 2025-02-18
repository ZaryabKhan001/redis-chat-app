"use server";

import { redis } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function checkAuthStatus() {
  try {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user) {
      return { success: false };
    }

    const userId = `user:${user.id}`;

    const isUserExists = await redis.hgetall(userId);

    // Signup
    if (!isUserExists) {
      const isImageNull = user.picture?.includes("gravatar");
      console.log(isImageNull);
      const image = isImageNull ? "" : user.picture;
      console.log(image);

      const newUser = await redis.hset(userId, {
        id: user.id,
        name: `${user.given_name} ${user.family_name}`,
        email: user.email,
        image: image || "",
      });

      if (!newUser) {
        return { success: false };
      }

      return { success: true, user: user };
    }

    return { success: true, user: user };
  } catch (error) {
    console.log("Error in check auth status function", error);
    throw error;
  }
}
