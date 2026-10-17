import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { PublicExperience } from "./pages/public/PublicExperience";
import { HealthWorkspace } from "./layouts/HealthWorkspace";
import { type AppUser, buttaApi, setSessionExpiredHandler } from "./services/api";
import { DEMO_SESSION_KEY } from "./services/demoStorage";
import { isWorkspacePath } from "./utils/routes";
import { clearVisitNotes } from "./utils/visitNotes";

function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [restoringSession, setRestoringSession] = useState(isWorkspacePath);
  const [sessionNotice, setSessionNotice] = useState("");

  // A 401 on any authenticated call means the JWT cookie died server-side
  // (expiry or invalidation) mid-session. Without this the UI would keep
  // showing the workspace as if still logged in until the next full reload.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser((current) => {
        if (!current || current.demo) return current;
        window.localStorage.removeItem(DEMO_SESSION_KEY);
        window.history.pushState({}, "", "/signin");
        setSessionNotice("Your session expired. Please sign in again.");
        return null;
      });
    });
    return () => setSessionExpiredHandler(null);
  }, []);

  // Catches the case where the cookie expired while the tab was backgrounded
  // or the machine was asleep: re-validate as soon as the tab is focused again
  // instead of waiting for the next action to fail.
  useEffect(() => {
    function revalidateOnFocus() {
      if (document.visibilityState !== "visible") return;
      if (!user || user.demo) return;
      buttaApi.me().catch(() => undefined);
    }
    document.addEventListener("visibilitychange", revalidateOnFocus);
    window.addEventListener("focus", revalidateOnFocus);
    return () => {
      document.removeEventListener("visibilitychange", revalidateOnFocus);
      window.removeEventListener("focus", revalidateOnFocus);
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function restoreWorkspaceSession() {
      if (!isWorkspacePath()) {
        setRestoringSession(false);
        return;
      }

      const storedDemo = window.localStorage.getItem(DEMO_SESSION_KEY);
      if (storedDemo) {
        try {
          const demoUser = JSON.parse(storedDemo) as AppUser;
          if (demoUser.demo && !cancelled) setUser(demoUser);
          setRestoringSession(false);
          return;
        } catch {
          window.localStorage.removeItem(DEMO_SESSION_KEY);
        }
      }

      try {
        const { user: restoredUser } = await buttaApi.me();
        if (!cancelled) setUser(restoredUser);
      } catch {
        if (!cancelled && isWorkspacePath()) {
          window.history.replaceState({}, "", "/signin");
        }
      } finally {
        if (!cancelled) setRestoringSession(false);
      }
    }

    void restoreWorkspaceSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function handleHistoryNavigation() {
      if (!isWorkspacePath()) {
        setRestoringSession(false);
        setUser(null);
        return;
      }
      if (user) return;

      setRestoringSession(true);
      const storedDemo = window.localStorage.getItem(DEMO_SESSION_KEY);
      if (storedDemo) {
        try {
          const demoUser = JSON.parse(storedDemo) as AppUser;
          if (demoUser.demo && !cancelled) setUser(demoUser);
          if (!cancelled) setRestoringSession(false);
          return;
        } catch {
          window.localStorage.removeItem(DEMO_SESSION_KEY);
        }
      }

      try {
        const { user: restoredUser } = await buttaApi.me();
        if (!cancelled) setUser(restoredUser);
      } catch {
        if (!cancelled) window.history.replaceState({}, "", "/signin");
      } finally {
        if (!cancelled) setRestoringSession(false);
      }
    }

    const onPopState = () => void handleHistoryNavigation();
    window.addEventListener("popstate", onPopState);
    return () => {
      cancelled = true;
      window.removeEventListener("popstate", onPopState);
    };
  }, [user]);

  function enterWorkspace(nextUser: AppUser) {
    if (nextUser.demo) window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(nextUser));
    else window.localStorage.removeItem(DEMO_SESSION_KEY);
    setSessionNotice("");
    setUser(nextUser);
  }

  async function signOut() {
    if (user && !user.demo) await buttaApi.logout().catch(() => undefined);
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    clearVisitNotes();
    window.history.pushState({}, "", "/");
    setSessionNotice("");
    setUser(null);
  }

  if (restoringSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-teal" role="status" aria-label="Restoring your session">
        <Leaf className="animate-pulse" size={34} fill="currentColor" strokeWidth={1.4} />
      </div>
    );
  }

  if (!user) return <PublicExperience onEnter={enterWorkspace} notice={sessionNotice} />;

  return <HealthWorkspace user={user} onSignOut={signOut} />;
}

export default App;
