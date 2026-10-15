import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import type { AppUser } from "../../services/api";
import { AuthPage } from "./AuthPage";
import { LandingPage } from "./LandingPage";
import { OnboardingPage } from "./OnboardingPage";

gsap.registerPlugin(ScrollTrigger);

export type PublicScreen = "home" | "signin" | "signup" | "onboarding";

export type AuthMode = "signin" | "signup";

export type PublicExperienceProps = {
  onEnter: (user: AppUser) => void;
  notice?: string;
};

const demoUser: AppUser = {
  id: "demo-user",
  email: "maya@demo.butta.health",
  firstName: "Maya",
  lastName: "Chen",
  demo: true,
};

function routeToScreen(): PublicScreen {
  if (window.location.pathname === "/signin") return "signin";
  if (window.location.pathname === "/signup") return "signup";
  if (window.location.pathname === "/onboarding") return "onboarding";
  return "home";
}

function screenPath(screen: PublicScreen) {
  return screen === "home" ? "/" : `/${screen}`;
}

export function PublicExperience({ onEnter, notice }: PublicExperienceProps) {
  const [screen, setScreen] = useState<PublicScreen>(routeToScreen);
  const [pendingUser, setPendingUser] = useState<AppUser | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  function transitionScreen(commit: () => void) {
    const currentScreen = stageRef.current?.querySelector(".public-screen");
    if (!currentScreen) {
      commit();
      return;
    }

    gsap.killTweensOf(currentScreen);
    gsap.to(currentScreen, {
      autoAlpha: 0,
      y: -20,
      scale: 0.995,
      pointerEvents: "none",
      duration: 0.36,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(currentScreen, {
          clearProps: "opacity,visibility,transform,pointerEvents",
        });
        commit();
      },
    });
  }

  function navigate(next: PublicScreen) {
    if (next === screen) return;

    const commit = () => {
      window.history.pushState({}, "", screenPath(next));
      setScreen(next);
    };
    transitionScreen(commit);
  }

  useLayoutEffect(() => {
    const onPopState = () => setScreen(routeToScreen());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const context = gsap.context(() => {
      const incomingScreen = stageRef.current?.querySelector(".public-screen");
      if (incomingScreen) {
        gsap.set(incomingScreen, {
          clearProps: "opacity,visibility,transform,pointerEvents",
        });
      }

      const isLanding = Boolean(stageRef.current?.querySelector(".hero-visual-frame"));
      const isAuth = Boolean(stageRef.current?.querySelector(".auth-left-section"));
      const timeline = gsap.timeline({ delay: 0.3, defaults: { ease: "expo.out" } });

      if (isLanding) {
        timeline
          .fromTo(".public-header", { autoAlpha: 0, y: -96 }, { autoAlpha: 1, y: 0, duration: 0.9 })
          .fromTo(
            ".hero-left-section",
            { autoAlpha: 0, x: -180 },
            { autoAlpha: 1, x: 0, duration: 1.1, clearProps: "transform" },
            "-=0.35",
          )
          .fromTo(
            ".hero-right-section",
            { autoAlpha: 0, x: 180 },
            { autoAlpha: 1, x: 0, duration: 1.1, clearProps: "transform" },
            "-=0.82",
          )
          .fromTo(
            ".hero-copy-item",
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.11, ease: "power3.out" },
            "-=0.72",
          )
          .fromTo(
            ".hero-visual-frame",
            { clipPath: "inset(0 0 100% 0)", scale: 0.94 },
            { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1, ease: "power3.out" },
            "-=0.92",
          )
          .fromTo(
            ".hero-float",
            { autoAlpha: 0, y: 28, scale: 0.84 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.14, ease: "back.out(1.5)" },
            "-=0.4",
          )
          .fromTo(".hero-support", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.62 }, "-=0.12")
          .call(() => {
            gsap.to(".hero-float-a", { y: -7, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.to(".hero-float-b", { y: 7, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.to(".hero-float-c", { y: -5, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
          });

        const header = stageRef.current?.querySelector(".public-header");
        if (header) {
          ScrollTrigger.create({
            start: 28,
            end: "max",
            onUpdate: (self) => header.classList.toggle("is-scrolled", self.scroll() > 28),
          });
        }

        gsap.fromTo(
          ".detail-reveal",
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".landing-detail", start: "top 78%", once: true },
          },
        );
      } else if (isAuth) {
        timeline
          .fromTo(".auth-header", { autoAlpha: 0, y: -88 }, { autoAlpha: 1, y: 0, duration: 0.82 })
          .fromTo(
            ".auth-left-section",
            { autoAlpha: 0, x: -180 },
            { autoAlpha: 1, x: 0, duration: 1.05, clearProps: "transform,opacity,visibility,willChange" },
            "-=0.3",
          )
          .fromTo(
            ".auth-image-reveal",
            { clipPath: "inset(0 100% 0 0)", scale: 1.04 },
            { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.05 },
            "-=0.72",
          )
          .fromTo(
            ".auth-overlay-nav",
            { autoAlpha: 0, y: -24 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.6",
          )
          .fromTo(
            ".auth-right-section",
            { autoAlpha: 0, x: 180 },
            { autoAlpha: 1, x: 0, duration: 1.05, clearProps: "transform" },
            "-=0.84",
          )
          .fromTo(
            ".auth-form-content",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.06, ease: "power3.out" },
            "-=0.55",
          );
      } else {
        timeline
          .fromTo(".public-visual", { autoAlpha: 0, x: -36 }, { autoAlpha: 1, x: 0, duration: 0.8 })
          .fromTo(".public-reveal", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.1 }, "-=0.45");
      }
    }, stageRef);
    return () => context.revert();
  }, [screen]);

  function enterDemo() {
    const commit = () => {
      window.history.pushState({}, "", "/app/dashboard");
      onEnter(demoUser);
    };
    transitionScreen(commit);
  }

  return (
    <div ref={stageRef} className="min-h-screen overflow-x-hidden bg-paper text-ink">
      {screen === "home" && <LandingPage key="home" navigate={navigate} enterDemo={enterDemo} />}
      {(screen === "signin" || screen === "signup") && (
        <AuthPage
          key={screen}
          mode={screen}
          navigate={navigate}
          enterDemo={enterDemo}
          notice={screen === "signin" ? notice : undefined}
          onAuthenticated={(user, isNew) => {
            setPendingUser(user);
            if (isNew) navigate("onboarding");
            else {
              window.history.pushState({}, "", "/app/dashboard");
              onEnter(user);
            }
          }}
        />
      )}
      {screen === "onboarding" && (
        <OnboardingPage
          key="onboarding"
          user={pendingUser || demoUser}
          onBack={() => navigate("signup")}
          onComplete={(user) => {
            window.history.pushState({}, "", "/app/dashboard");
            onEnter(user);
          }}
        />
      )}
    </div>
  );
}
