import type { AppUser, HealthProfile, HealthProfileInput } from "../services/api";

export const emptyHealthProfile: HealthProfileInput = {
  dateOfBirth: null,
  sex: null,
  bloodGroup: null,
  allergies: [],
  existingConditions: [],
  currentMedications: [],
  emergencyContactName: null,
  emergencyContactPhone: null,
};

export function toProfileInput(profile: HealthProfile | null): HealthProfileInput {
  if (!profile) return emptyHealthProfile;
  const { dateOfBirth, sex, bloodGroup, allergies, existingConditions, currentMedications, emergencyContactName, emergencyContactPhone } = profile;
  return { dateOfBirth, sex, bloodGroup, allergies, existingConditions, currentMedications, emergencyContactName, emergencyContactPhone };
}

export function profileCompletion(user: AppUser, profile: HealthProfile | null) {
  const checks = [
    user.firstName,
    user.lastName,
    user.email,
    profile?.dateOfBirth,
    profile?.sex,
    profile?.bloodGroup,
    profile?.allergies.length,
    profile?.existingConditions.length,
    profile?.currentMedications.length,
    profile?.emergencyContactName,
    profile?.emergencyContactPhone,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
