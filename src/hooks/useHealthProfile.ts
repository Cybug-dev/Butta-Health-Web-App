import { useEffect, useState } from "react";
import { ApiError, buttaApi, type AppUser, type HealthProfile, type HealthProfileInput } from "../services/api";
import { DEMO_PROFILE_KEY } from "../services/demoStorage";
import { emptyHealthProfile } from "../utils/profile";

export function useHealthProfile(user: AppUser, onSaved: () => void) {
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);

  useEffect(() => {
    if (user.demo) {
      const demoProfile = window.localStorage.getItem(DEMO_PROFILE_KEY);
      const fallbackProfile: HealthProfileInput = {
        ...emptyHealthProfile,
        dateOfBirth: "1992-05-18",
        sex: "Female",
        bloodGroup: "O+",
        allergies: ["Pollen"],
        existingConditions: ["Migraine"],
        currentMedications: ["Acetaminophen as needed"],
        emergencyContactName: "Jordan Johnson",
      };
      if (!demoProfile) {
        setHealthProfile(fallbackProfile);
        return;
      }
      try {
        setHealthProfile(JSON.parse(demoProfile) as HealthProfileInput);
      } catch {
        window.localStorage.removeItem(DEMO_PROFILE_KEY);
        setHealthProfile(fallbackProfile);
      }
      return;
    }

    buttaApi
      .getProfile()
      .then(({ profile }) => setHealthProfile(profile))
      .catch((error: unknown) => {
        if (!(error instanceof ApiError) || error.status !== 404) {
          console.error("Unable to load health profile", error);
        }
      });
  }, [user]);

  async function saveHealthProfile(nextProfile: HealthProfileInput) {
    if (user.demo) {
      window.localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(nextProfile));
      setHealthProfile(nextProfile);
      return;
    }

    const { profile } = await buttaApi.saveProfile(nextProfile);
    setHealthProfile(profile);
    onSaved();
  }

  return { healthProfile, saveHealthProfile };
}
