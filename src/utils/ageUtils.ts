
export type AgeGroup = '3-4' | '5-6' | '7-8' | '9-10';

export function getAgeGroup(age: number): AgeGroup {
  if (age >= 3 && age <= 4) return '3-4';
  if (age >= 5 && age <= 6) return '5-6'; 
  if (age >= 7 && age <= 8) return '7-8';
  if (age >= 9 && age <= 10) return '9-10';
  return '3-4'; // Default fallback
}

export function getRouteForAgeGroup(ageGroup: AgeGroup): string {
  return `/govorne-igre/igra-ujemanja-${ageGroup}`;
}

export function shouldAllowNextLevel(childAge: number, requiredAgeGroup: AgeGroup): boolean {
  // Allow access to next level if child is within 6 months of next age group
  const ageGroupRanges = {
    '3-4': [3, 4.5],
    '5-6': [4.5, 6.5], 
    '7-8': [6.5, 8.5],
    '9-10': [8.5, 10.5]
  };
  
  const [minAge, maxAge] = ageGroupRanges[requiredAgeGroup];
  return childAge >= minAge && childAge <= maxAge;
}
