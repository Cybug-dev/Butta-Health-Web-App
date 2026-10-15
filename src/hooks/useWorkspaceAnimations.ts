import gsap from "gsap";
import { useLayoutEffect, type RefObject } from "react";
import type { ViewId } from "../types";

/** Entrance motion for the app shell and for each view when the route changes. */
export function useWorkspaceAnimations(viewRef: RefObject<HTMLElement | null>, activeView: ViewId) {
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".app-shell",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "transform,opacity,visibility,willChange" },
      );
    });

    return () => context.revert();
  }, []);

  useLayoutEffect(() => {
    if (!viewRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".view-panel",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out", clearProps: "transform,opacity,visibility,willChange" },
      );
      gsap.fromTo(
        ".stagger-in",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.045, delay: 0.08, clearProps: "transform,opacity,visibility,willChange" },
      );
      gsap.fromTo(
        ".dashboard-enter",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out", stagger: 0.08, delay: 0.08, clearProps: "transform,opacity,visibility" },
      );
      gsap.fromTo(
        ".dashboard-rail-enter",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: "power2.out", delay: 0.16, clearProps: "opacity,visibility" },
      );
    }, viewRef);

    return () => context.revert();
  }, [activeView, viewRef]);
}
