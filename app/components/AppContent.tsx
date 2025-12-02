"use client";

import { ReactNode } from "react";
import { useLoading } from "../context/LoadingContext";

export function AppContents({ children }: { children: ReactNode }) {
  const { isInitialLoading } = useLoading();

  return (
    <div
      className={`transition-opacity duration-300 ${
        isInitialLoading ? "opacity-0 invisible" : "opacity-100 visible"
      }`}
      style={{
        pointerEvents: isInitialLoading ? "none" : "auto",
      }}>
      {children}
    </div>
  );
}
