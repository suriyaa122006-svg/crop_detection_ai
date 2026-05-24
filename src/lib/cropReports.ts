export interface CropReportOwnerIdentity {
  userId?: string;
  userName: string;
  userMobile: string;
  userEmail: string;
}

const CROPREPORTS_CACHE_PREFIX = 'cropreports-cache-v1';

function toTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function resolveCropReportOwnerIdentity(user?: any): CropReportOwnerIdentity | null {
  if (typeof window !== 'undefined' && !user) {
    try {
      const storedUser = window.localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch {
      user = null;
    }
  }

  if (!user) {
    return null;
  }

  const registrationData = user.registrationData || {};
  const userMobile = toTrimmedString(user.mobile || registrationData.mobile);

  if (!userMobile) {
    return null;
  }

  const userName = toTrimmedString(user.name || registrationData.name) || 'Farmer';
  const userEmail = toTrimmedString(user.email || registrationData.email);
  const userId = toTrimmedString(user._id || user.id || registrationData._id);

  return {
    userId: userId || undefined,
    userName,
    userMobile,
    userEmail,
  };
}

export function getCropReportsCacheKey(userMobile?: string | null) {
  return userMobile ? `${CROPREPORTS_CACHE_PREFIX}:${userMobile}` : CROPREPORTS_CACHE_PREFIX;
}
