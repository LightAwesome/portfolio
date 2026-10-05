import { createContext, useContext } from "react";
import type { Buffer } from "./buffer";

export const BufferContext = createContext<Buffer | null>(null);
export const useBufferApi = () => useContext(BufferContext);
