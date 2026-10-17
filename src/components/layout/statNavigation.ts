import { createContext } from "react";

export type StatTarget = "records" | "status" | "symptoms" | "watch";

/** Lets every page's stat band open its destination without threading a prop through each page. */
export const StatNavigationContext = createContext<((target: StatTarget) => void) | null>(null);
