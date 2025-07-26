import { useContext } from "react";
import { DonghuaContext } from "../contexts/DonghuaContext";

export const useDonghua = () => {
  const context = useContext(DonghuaContext);
  if (!context) {
    throw new Error("useDonghua must be used within a DonghuaProvider");
  }
  return context;
};
