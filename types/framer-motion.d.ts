declare module "framer-motion" {
  import type { ComponentType } from "react";

  export const motion: Record<string, ComponentType<any>>;
  export function animate(...args: any[]): { stop: () => void };
  export function useMotionValue<T = number>(initial: T): any;
  export function useScroll(...args: any[]): any;
  export function useTransform(...args: any[]): any;
}
