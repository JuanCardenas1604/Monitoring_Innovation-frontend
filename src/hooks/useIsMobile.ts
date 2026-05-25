import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    };
    handle(mq);
    if (mq.addEventListener) mq.addEventListener("change", handle as (e: MediaQueryListEvent) => void);
    else mq.addListener(handle as (e: MediaQueryListEvent) => void);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle as (e: MediaQueryListEvent) => void);
      else mq.removeListener(handle as (e: MediaQueryListEvent) => void);
    };
  }, [breakpoint]);

  return isMobile;
}
