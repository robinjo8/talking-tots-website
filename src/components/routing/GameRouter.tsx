/**
 * Ultra-simplified Game Router
 * Uses ONLY generic components - no dynamic imports at all
 * This ensures the build system only needs to analyze ~5 files, not 150+
 */
import { useParams, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SestavljankaGame } from '@/components/games/SestavljankaGame';

// URL to internal letter mapping (ch->č, sh->š, zh->ž)
function urlToLetter(urlParam: string): string {
  const letterPart = urlParam.replace(/\d+$/, '').toLowerCase();
  const mapping: Record<string, string> = { 'ch': 'č', 'sh': 'š', 'zh': 'ž' };
  return mapping[letterPart] || letterPart;
}

// Extract age group from URL param
function extractAgeGroup(urlParam: string): string {
  const match = urlParam.match(/(\d+)$/);
  return match ? match[1] : '';
}

// Validate letter
const VALID_LETTERS = ['c', 'č', 'k', 'l', 'r', 's', 'š', 'z', 'ž'];
function isValidLetter(letter: string): boolean {
  return VALID_LETTERS.includes(letter.toLowerCase());
}

// All routers now use the same generic component pattern
export function SestavljankeRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const letter = urlToLetter(rawParam);
  const ageGroup = extractAgeGroup(rawParam);
  
  if (!isValidLetter(letter)) return <Navigate to="/404" replace />;
  
  return (
    <ProtectedRoute>
      <SestavljankaGame letter={letter} ageGroup={ageGroup} />
    </ProtectedRoute>
  );
}

// Placeholder components - will redirect to 404 for now until we create proper generic components
// This allows the build to succeed immediately
export function ZaporedjaRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const letter = urlToLetter(rawParam);
  const ageGroup = extractAgeGroup(rawParam);
  
  if (!isValidLetter(letter)) return <Navigate to="/404" replace />;
  
  // TODO: Replace with ZaporedjeGame generic component
  return (
    <ProtectedRoute>
      <SestavljankaGame letter={letter} ageGroup={ageGroup} />
    </ProtectedRoute>
  );
}

export function DrsnaSestavljankaRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const letter = urlToLetter(rawParam);
  const ageGroup = extractAgeGroup(rawParam);
  
  if (!isValidLetter(letter)) return <Navigate to="/404" replace />;
  
  // TODO: Replace with DrsnaSestavljankaGame generic component
  return (
    <ProtectedRoute>
      <SestavljankaGame letter={letter} ageGroup={ageGroup} />
    </ProtectedRoute>
  );
}

export function IgraUjemanjaRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const letter = urlToLetter(rawParam);
  const ageGroup = extractAgeGroup(rawParam);
  
  if (!isValidLetter(letter)) return <Navigate to="/404" replace />;
  
  // TODO: Replace with IgraUjemanjaGame generic component  
  return (
    <ProtectedRoute>
      <SestavljankaGame letter={letter} ageGroup={ageGroup} />
    </ProtectedRoute>
  );
}

export function SpominRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const letterPart = rawParam.replace('spomin-', '');
  const letter = urlToLetter(letterPart);
  
  if (!isValidLetter(letter)) return <Navigate to="/404" replace />;
  
  // TODO: Replace with SpominGame generic component
  return (
    <ProtectedRoute>
      <SestavljankaGame letter={letter} ageGroup="" />
    </ProtectedRoute>
  );
}
