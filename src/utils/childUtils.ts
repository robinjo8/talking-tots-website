/**
 * Utility functions for child data processing
 */

/**
 * Calculates age in years from birth date
 * @param birthDate - The birth date
 * @returns age in years, or a default age if birthDate is null
 */
export function calculateAge(birthDate: Date | null): number {
  if (!birthDate) {
    console.warn('calculateAge: birthDate is null, returning default age of 5');
    return 5; // Default age to satisfy NOT NULL constraint
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // If we haven't reached the birthday this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Ensure age is positive and reasonable
  if (age < 0) {
    console.warn('calculateAge: Negative age calculated, returning default age of 5');
    return 5;
  }
  
  if (age > 18) {
    console.warn('calculateAge: Age over 18 calculated, returning 18');
    return 18;
  }

  console.log(`calculateAge: Calculated age ${age} from birthDate:`, birthDate);
  return age;
}

/**
 * Validates child data before saving
 * @param child - The child object to validate
 * @returns validation result with success flag and error message
 */
export function validateChildData(child: any): { isValid: boolean; error?: string } {
  if (!child.name || child.name.trim() === '') {
    return { isValid: false, error: 'Child name is required' };
  }

  if (!child.birthDate) {
    return { isValid: false, error: 'Child birth date is required' };
  }

  if (!child.gender) {
    return { isValid: false, error: 'Child gender is required' };
  }

  return { isValid: true };
}