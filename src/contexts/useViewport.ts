import { useContext } from "react";
import { ViewportContext } from "./ViewportContext";

export function useViewport() {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return context;
}
