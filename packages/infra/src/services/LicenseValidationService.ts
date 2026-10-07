import { LicenseState } from '@semburat/domain';

const PUBLISHABLE_LICENSES = new Set<string>([
  LicenseState.OWNED,
  LicenseState.LICENSED,
  LicenseState.PUBLIC_DOMAIN,
  LicenseState.PERMITTED,
  LicenseState.GENERATED,
]);

const CREDIT_REQUIRED_LICENSES = new Set<string>([LicenseState.LICENSED, LicenseState.PERMITTED]);

export class LicenseValidationService {
  validateLicense(licenseState: string): { valid: boolean; reason?: string } {
    if (typeof licenseState !== 'string') {
      return { valid: false, reason: 'License state must be a string' };
    }

    const normalized = licenseState.trim().toLowerCase();
    if (!normalized) {
      return { valid: false, reason: 'License state cannot be empty' };
    }

    const known = new Set<string>([
      LicenseState.OWNED,
      LicenseState.LICENSED,
      LicenseState.PUBLIC_DOMAIN,
      LicenseState.PERMITTED,
      LicenseState.GENERATED,
      LicenseState.UNKNOWN,
      LicenseState.RESTRICTED,
    ]);

    if (!known.has(normalized)) {
      return { valid: false, reason: `Unknown license state: ${licenseState}` };
    }

    if (normalized === LicenseState.UNKNOWN || normalized === LicenseState.RESTRICTED) {
      return { valid: false, reason: `License state not publishable: ${licenseState}` };
    }

    return { valid: true };
  }

  canBePublished(licenseState: string): boolean {
    return PUBLISHABLE_LICENSES.has(licenseState);
  }

  requiresCredit(licenseState: string): boolean {
    return CREDIT_REQUIRED_LICENSES.has(licenseState);
  }
}
