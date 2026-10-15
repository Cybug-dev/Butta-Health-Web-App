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
