import { useEffect, useState } from "react";
import type { ViewId } from "../types";
import { isWorkspacePath, viewFromPath, workspacePaths } from "../utils/routes";

export function useWorkspaceNavigation() {
  const [activeView, setActiveView] = useState<ViewId>(viewFromPath);
  const [insightRailOpen, setInsightRailOpen] = useState(false);

  function navigateView(nextView: ViewId) {
    const nextPath = workspacePaths[nextView];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setActiveView(nextView);
    setInsightRailOpen(false);
  }

  // Each screen opens at the top instead of keeping the previous screen's scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [activeView]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/app" || !Object.values(workspacePaths).includes(currentPath)) {
      window.history.replaceState({}, "", workspacePaths.dashboard);
      setActiveView("dashboard");
    }

    const onPopState = () => {
      if (isWorkspacePath()) setActiveView(viewFromPath());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return { activeView, navigateView, insightRailOpen, setInsightRailOpen };
}
