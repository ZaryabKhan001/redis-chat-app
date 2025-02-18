import React from "react";
import Image from "next/image";
import AuthButtons from "./AuthButtons";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    return redirect("/");
  }

  return (
    <div className="flex w-screen h-screen">
      <div className="flex-1 flex justify-center items-center relative overflow-hidden bg-[#651c2b] dark:bg-[#651c2b55]">
        <img
          src="/redis-logo.svg"
          alt="Redis Logo"
          className="absolute -left-1/4 -bottom-52 opacity-25 lg:scale-125 xl:scale-100 scale-[2] pointer-events-none select-none -z-1"
        />
        <div className="flex flex-col gap-2 px-4 xl:ml-40 text-center md:text-start font-semibold">
          <Image
            src={"/logo.png"}
            alt="Redis Logo"
            width={763}
            height={173}
            className="mt-20 z-0 pointer-events-none select-none w-[420px]"
          />
          <p className="text-2xl md:text-3xl text-balance z-10">
            The{" "}
            <span className="text-white bg-red-500 px-2 font-bold">
              Ultimate
            </span>{" "}
            Chat App
          </p>
          <p className="text-2xl md:text-3xl text-balance z-10 mb-32">
            You{" "}
            <span className="text-white bg-green-500/90 px-2 font-bold">
              Need To
            </span>{" "}
            Build
          </p>
          <AuthButtons />
        </div>
      </div>
      <div className="flex-1 relative justify-center items-center hidden md:flex overflow-hidden bg-noise">
        <Image
          src={"/hero-right.png"}
          alt="Redis Database"
          fill
          className="object-cover dark:opacity-60 opacity-90 pointer-events-none select-none"
        />
      </div>
    </div>
  );
};

export default page;
