"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

interface TanStackProviderProps {
  children: React.ReactNode;
}

const TanStackProvider = ({ children }: TanStackProviderProps) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default TanStackProvider;
