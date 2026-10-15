import { useEffect, useState } from "react";
import { buttaApi, type AppUser } from "../services/api";
import { DEMO_AI_CONSENT_KEY } from "../services/demoStorage";
import type { AiConsent } from "../types";

export function useAiConsent(user: AppUser) {
  const [aiConsent, setAiConsent] = useState<AiConsent | null>(null);

  useEffect(() => {
    if (user.demo) {
      const stored = window.localStorage.getItem(DEMO_AI_CONSENT_KEY);
      setAiConsent({
        granted: stored === "true",
        policyVersion: "demo",
        grantedAt: null,
        revokedAt: null,
        updatedAt: null,
      });
      return;
    }

    buttaApi
      .getAiConsent()
      .then(({ consent }) => setAiConsent(consent))
      .catch((error: unknown) => console.error("Unable to load AI consent", error));
  }, [user]);

  async function saveAiConsent(granted: boolean) {
    if (user.demo) {
      window.localStorage.setItem(DEMO_AI_CONSENT_KEY, String(granted));
      setAiConsent((current) => ({ ...(current ?? { policyVersion: "demo", grantedAt: null, revokedAt: null, updatedAt: null }), granted }));
      return;
    }
    const { consent } = await buttaApi.setAiConsent(granted);
    setAiConsent(consent);
  }

  return { aiConsent, saveAiConsent };
}
