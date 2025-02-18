"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const AuthButtons = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex flex-1 flex-col md:flex-row gap-3 relative z-50">
      <RegisterLink className="flex-1">
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
        >
          Sign Up
        </Button>
      </RegisterLink>
      <LoginLink className="flex-1">
        <Button
          className="w-full"
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
        >
          Login
        </Button>
      </LoginLink>
    </div>
  );
};

export default AuthButtons;
