/**
 * Dynamic Game Router Components
 * 
 * Te komponente rešujejo problem Unicode normalizacije za šumnike (č, š, ž).
 * Brskalnik lahko pošlje različne Unicode oblike (NFC vs NFD),
 * te komponente pa normalizirajo pot in najdejo ustrezno komponento.
 */
import { useParams, Navigate } from 'react-router-dom';
import { Suspense, ComponentType, lazy } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Loading component
const GameLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// ============================================
// HELPER: Normalize Unicode and decode URL
// ============================================
const normalizeLetterParam = (param: string): string => {
  try {
    // First decode URL encoding (%C4%8D -> č)
    const decoded = decodeURIComponent(param);
    // Then normalize Unicode (NFD -> NFC)
    return decoded.normalize('NFC').toLowerCase();
  } catch {
    return param.toLowerCase();
  }
};

// Map lowercase letters to component name format
const letterToComponentLetter = (letter: string): string => {
  const map: Record<string, string> = {
    'c': 'C',
    'č': 'Č',
    'k': 'K',
    'l': 'L',
    'r': 'R',
    's': 'S',
    'š': 'Š',
    'z': 'Z',
    'ž': 'Ž',
  };
  return map[letter] || letter.toUpperCase();
};

// ============================================
// SPOMIN KOMPONENTE
// ============================================
const SpominC = lazy(() => import('@/pages/SpominC'));
const SpominČ = lazy(() => import('@/pages/SpominČ'));
const SpominK = lazy(() => import('@/pages/SpominK'));
const SpominL = lazy(() => import('@/pages/SpominL'));
const SpominR = lazy(() => import('@/pages/SpominR'));
const SpominS = lazy(() => import('@/pages/SpominS'));
const SpominŠ = lazy(() => import('@/pages/SpominŠ'));
const SpominZ = lazy(() => import('@/pages/SpominZ'));
const SpominŽ = lazy(() => import('@/pages/SpominŽ'));

const SPOMIN_COMPONENTS: Record<string, ComponentType<any>> = {
  'c': SpominC, 'č': SpominČ, 'k': SpominK, 'l': SpominL, 'r': SpominR,
  's': SpominS, 'š': SpominŠ, 'z': SpominZ, 'ž': SpominŽ,
};

// ============================================
// SESTAVLJANKE KOMPONENTE
// ============================================
const SestavljankeC = lazy(() => import('@/pages/SestavljankeC'));
const SestavljankeC56 = lazy(() => import('@/pages/SestavljankeC56'));
const SestavljankeC78 = lazy(() => import('@/pages/SestavljankeC78'));
const SestavljankeC910 = lazy(() => import('@/pages/SestavljankeC910'));
const SestavljankeČ = lazy(() => import('@/pages/SestavljankeČ'));
const SestavljankeČ56 = lazy(() => import('@/pages/SestavljankeČ56'));
const SestavljankeČ78 = lazy(() => import('@/pages/SestavljankeČ78'));
const SestavljankeČ910 = lazy(() => import('@/pages/SestavljankeČ910'));
const SestavljankeK = lazy(() => import('@/pages/SestavljankeK'));
const SestavljankeK56 = lazy(() => import('@/pages/SestavljankeK56'));
const SestavljankeK78 = lazy(() => import('@/pages/SestavljankeK78'));
const SestavljankeK910 = lazy(() => import('@/pages/SestavljankeK910'));
const SestavljankeL = lazy(() => import('@/pages/SestavljankeL'));
const SestavljankeL56 = lazy(() => import('@/pages/SestavljankeL56'));
const SestavljankeL78 = lazy(() => import('@/pages/SestavljankeL78'));
const SestavljankeL910 = lazy(() => import('@/pages/SestavljankeL910'));
const SestavljankeR = lazy(() => import('@/pages/SestavljankeR'));
const SestavljankeR56 = lazy(() => import('@/pages/SestavljankeR56'));
const SestavljankeR78 = lazy(() => import('@/pages/SestavljankeR78'));
const SestavljankeR910 = lazy(() => import('@/pages/SestavljankeR910'));
const SestavljankeS = lazy(() => import('@/pages/SestavljankeS'));
const SestavljankeS56 = lazy(() => import('@/pages/SestavljankeS56'));
const SestavljankeS78 = lazy(() => import('@/pages/SestavljankeS78'));
const SestavljankeS910 = lazy(() => import('@/pages/SestavljankeS910'));
const SestavljankeŠ = lazy(() => import('@/pages/SestavljankeŠ'));
const SestavljankeŠ56 = lazy(() => import('@/pages/SestavljankeŠ56'));
const SestavljankeŠ78 = lazy(() => import('@/pages/SestavljankeŠ78'));
const SestavljankeŠ910 = lazy(() => import('@/pages/SestavljankeŠ910'));
const SestavljankeZ = lazy(() => import('@/pages/SestavljankeZ'));
const SestavljankeZ56 = lazy(() => import('@/pages/SestavljankeZ56'));
const SestavljankeZ78 = lazy(() => import('@/pages/SestavljankeZ78'));
const SestavljankeZ910 = lazy(() => import('@/pages/SestavljankeZ910'));
const SestavljankeŽ = lazy(() => import('@/pages/SestavljankeŽ'));
const SestavljankeŽ56 = lazy(() => import('@/pages/SestavljankeŽ56'));
const SestavljankeŽ78 = lazy(() => import('@/pages/SestavljankeŽ78'));
const SestavljankeŽ910 = lazy(() => import('@/pages/SestavljankeŽ910'));

type AgeGroupComponents = {
  base?: ComponentType<any>;
  '56'?: ComponentType<any>;
  '78'?: ComponentType<any>;
  '910'?: ComponentType<any>;
};

const SESTAVLJANKE_BY_LETTER: Record<string, AgeGroupComponents> = {
  'c': { base: SestavljankeC, '56': SestavljankeC56, '78': SestavljankeC78, '910': SestavljankeC910 },
  'č': { base: SestavljankeČ, '56': SestavljankeČ56, '78': SestavljankeČ78, '910': SestavljankeČ910 },
  'k': { base: SestavljankeK, '56': SestavljankeK56, '78': SestavljankeK78, '910': SestavljankeK910 },
  'l': { base: SestavljankeL, '56': SestavljankeL56, '78': SestavljankeL78, '910': SestavljankeL910 },
  'r': { base: SestavljankeR, '56': SestavljankeR56, '78': SestavljankeR78, '910': SestavljankeR910 },
  's': { base: SestavljankeS, '56': SestavljankeS56, '78': SestavljankeS78, '910': SestavljankeS910 },
  'š': { base: SestavljankeŠ, '56': SestavljankeŠ56, '78': SestavljankeŠ78, '910': SestavljankeŠ910 },
  'z': { base: SestavljankeZ, '56': SestavljankeZ56, '78': SestavljankeZ78, '910': SestavljankeZ910 },
  'ž': { base: SestavljankeŽ, '56': SestavljankeŽ56, '78': SestavljankeŽ78, '910': SestavljankeŽ910 },
};

// ============================================
// ZAPOREDJA KOMPONENTE
// ============================================
const ZaporedjaC = lazy(() => import('@/pages/ZaporedjaC'));
const ZaporedjaC56 = lazy(() => import('@/pages/ZaporedjaC56'));
const ZaporedjaC78 = lazy(() => import('@/pages/ZaporedjaC78'));
const ZaporedjaC910 = lazy(() => import('@/pages/ZaporedjaC910'));
const ZaporedjaČ = lazy(() => import('@/pages/ZaporedjaČ'));
const ZaporedjaČ56 = lazy(() => import('@/pages/ZaporedjaČ56'));
const ZaporedjaČ78 = lazy(() => import('@/pages/ZaporedjaČ78'));
const ZaporedjaČ910 = lazy(() => import('@/pages/ZaporedjaČ910'));
const ZaporedjaK = lazy(() => import('@/pages/ZaporedjaK'));
const ZaporedjaK56 = lazy(() => import('@/pages/ZaporedjaK56'));
const ZaporedjaK78 = lazy(() => import('@/pages/ZaporedjaK78'));
const ZaporedjaK910 = lazy(() => import('@/pages/ZaporedjaK910'));
const ZaporedjaL = lazy(() => import('@/pages/ZaporedjaL'));
const ZaporedjaL56 = lazy(() => import('@/pages/ZaporedjaL56'));
const ZaporedjaL78 = lazy(() => import('@/pages/ZaporedjaL78'));
const ZaporedjaL910 = lazy(() => import('@/pages/ZaporedjaL910'));
const ZaporedjaR = lazy(() => import('@/pages/ZaporedjaR'));
const ZaporedjaR56 = lazy(() => import('@/pages/ZaporedjaR56'));
const ZaporedjaR78 = lazy(() => import('@/pages/ZaporedjaR78'));
const ZaporedjaR910 = lazy(() => import('@/pages/ZaporedjaR910'));
const ZaporedjaS = lazy(() => import('@/pages/ZaporedjaS'));
const ZaporedjaS56 = lazy(() => import('@/pages/ZaporedjaS56'));
const ZaporedjaS78 = lazy(() => import('@/pages/ZaporedjaS78'));
const ZaporedjaS910 = lazy(() => import('@/pages/ZaporedjaS910'));
const ZaporedjaŠ = lazy(() => import('@/pages/ZaporedjaŠ'));
const ZaporedjaŠ56 = lazy(() => import('@/pages/ZaporedjaŠ56'));
const ZaporedjaŠ78 = lazy(() => import('@/pages/ZaporedjaŠ78'));
const ZaporedjaŠ910 = lazy(() => import('@/pages/ZaporedjaŠ910'));
const ZaporedjaZ = lazy(() => import('@/pages/ZaporedjaZ'));
const ZaporedjaZ56 = lazy(() => import('@/pages/ZaporedjaZ56'));
const ZaporedjaZ78 = lazy(() => import('@/pages/ZaporedjaZ78'));
const ZaporedjaZ910 = lazy(() => import('@/pages/ZaporedjaZ910'));
const ZaporedjaŽ = lazy(() => import('@/pages/ZaporedjaŽ'));
const ZaporedjaŽ56 = lazy(() => import('@/pages/ZaporedjaŽ56'));
const ZaporedjaŽ78 = lazy(() => import('@/pages/ZaporedjaŽ78'));
const ZaporedjaŽ910 = lazy(() => import('@/pages/ZaporedjaŽ910'));

const ZAPOREDJA_BY_LETTER: Record<string, AgeGroupComponents> = {
  'c': { base: ZaporedjaC, '56': ZaporedjaC56, '78': ZaporedjaC78, '910': ZaporedjaC910 },
  'č': { base: ZaporedjaČ, '56': ZaporedjaČ56, '78': ZaporedjaČ78, '910': ZaporedjaČ910 },
  'k': { base: ZaporedjaK, '56': ZaporedjaK56, '78': ZaporedjaK78, '910': ZaporedjaK910 },
  'l': { base: ZaporedjaL, '56': ZaporedjaL56, '78': ZaporedjaL78, '910': ZaporedjaL910 },
  'r': { base: ZaporedjaR, '56': ZaporedjaR56, '78': ZaporedjaR78, '910': ZaporedjaR910 },
  's': { base: ZaporedjaS, '56': ZaporedjaS56, '78': ZaporedjaS78, '910': ZaporedjaS910 },
  'š': { base: ZaporedjaŠ, '56': ZaporedjaŠ56, '78': ZaporedjaŠ78, '910': ZaporedjaŠ910 },
  'z': { base: ZaporedjaZ, '56': ZaporedjaZ56, '78': ZaporedjaZ78, '910': ZaporedjaZ910 },
  'ž': { base: ZaporedjaŽ, '56': ZaporedjaŽ56, '78': ZaporedjaŽ78, '910': ZaporedjaŽ910 },
};

// ============================================
// DRSNA SESTAVLJANKA KOMPONENTE
// ============================================
const DrsnaSestavljankaC34 = lazy(() => import('@/pages/DrsnaSestavljankaC34'));
const DrsnaSestavljankaC56 = lazy(() => import('@/pages/DrsnaSestavljankaC56'));
const DrsnaSestavljankaC78 = lazy(() => import('@/pages/DrsnaSestavljankaC78'));
const DrsnaSestavljankaC910 = lazy(() => import('@/pages/DrsnaSestavljankaC910'));
const DrsnaSestavljankaČ34 = lazy(() => import('@/pages/DrsnaSestavljankaČ34'));
const DrsnaSestavljankaČ56 = lazy(() => import('@/pages/DrsnaSestavljankaČ56'));
const DrsnaSestavljankaČ78 = lazy(() => import('@/pages/DrsnaSestavljankaČ78'));
const DrsnaSestavljankaČ910 = lazy(() => import('@/pages/DrsnaSestavljankaČ910'));
const DrsnaSestavljankaK34 = lazy(() => import('@/pages/DrsnaSestavljankaK34'));
const DrsnaSestavljankaK56 = lazy(() => import('@/pages/DrsnaSestavljankaK56'));
const DrsnaSestavljankaK78 = lazy(() => import('@/pages/DrsnaSestavljankaK78'));
const DrsnaSestavljankaK910 = lazy(() => import('@/pages/DrsnaSestavljankaK910'));
const DrsnaSestavljankaL34 = lazy(() => import('@/pages/DrsnaSestavljankaL34'));
const DrsnaSestavljankaL56 = lazy(() => import('@/pages/DrsnaSestavljankaL56'));
const DrsnaSestavljankaL78 = lazy(() => import('@/pages/DrsnaSestavljankaL78'));
const DrsnaSestavljankaL910 = lazy(() => import('@/pages/DrsnaSestavljankaL910'));
const DrsnaSestavljankaR34 = lazy(() => import('@/pages/DrsnaSestavljankaR34'));
const DrsnaSestavljankaR56 = lazy(() => import('@/pages/DrsnaSestavljankaR56'));
const DrsnaSestavljankaR78 = lazy(() => import('@/pages/DrsnaSestavljankaR78'));
const DrsnaSestavljankaR910 = lazy(() => import('@/pages/DrsnaSestavljankaR910'));
const DrsnaSestavljankaS34 = lazy(() => import('@/pages/DrsnaSestavljankaS34'));
const DrsnaSestavljankaS56 = lazy(() => import('@/pages/DrsnaSestavljankaS56'));
const DrsnaSestavljankaS78 = lazy(() => import('@/pages/DrsnaSestavljankaS78'));
const DrsnaSestavljankaS910 = lazy(() => import('@/pages/DrsnaSestavljankaS910'));
const DrsnaSestavljankaŠ34 = lazy(() => import('@/pages/DrsnaSestavljankaŠ34'));
const DrsnaSestavljankaŠ56 = lazy(() => import('@/pages/DrsnaSestavljankaŠ56'));
const DrsnaSestavljankaŠ78 = lazy(() => import('@/pages/DrsnaSestavljankaŠ78'));
const DrsnaSestavljankaŠ910 = lazy(() => import('@/pages/DrsnaSestavljankaŠ910'));
const DrsnaSestavljankaZ34 = lazy(() => import('@/pages/DrsnaSestavljankaZ34'));
const DrsnaSestavljankaZ56 = lazy(() => import('@/pages/DrsnaSestavljankaZ56'));
const DrsnaSestavljankaZ78 = lazy(() => import('@/pages/DrsnaSestavljankaZ78'));
const DrsnaSestavljankaZ910 = lazy(() => import('@/pages/DrsnaSestavljankaZ910'));
const DrsnaSestavljankaŽ34 = lazy(() => import('@/pages/DrsnaSestavljankaŽ34'));
const DrsnaSestavljankaŽ56 = lazy(() => import('@/pages/DrsnaSestavljankaŽ56'));
const DrsnaSestavljankaŽ78 = lazy(() => import('@/pages/DrsnaSestavljankaŽ78'));
const DrsnaSestavljankaŽ910 = lazy(() => import('@/pages/DrsnaSestavljankaŽ910'));

type DrsnaAgeGroupComponents = {
  '34'?: ComponentType<any>;
  '56'?: ComponentType<any>;
  '78'?: ComponentType<any>;
  '910'?: ComponentType<any>;
};

const DRSNA_BY_LETTER: Record<string, DrsnaAgeGroupComponents> = {
  'c': { '34': DrsnaSestavljankaC34, '56': DrsnaSestavljankaC56, '78': DrsnaSestavljankaC78, '910': DrsnaSestavljankaC910 },
  'č': { '34': DrsnaSestavljankaČ34, '56': DrsnaSestavljankaČ56, '78': DrsnaSestavljankaČ78, '910': DrsnaSestavljankaČ910 },
  'k': { '34': DrsnaSestavljankaK34, '56': DrsnaSestavljankaK56, '78': DrsnaSestavljankaK78, '910': DrsnaSestavljankaK910 },
  'l': { '34': DrsnaSestavljankaL34, '56': DrsnaSestavljankaL56, '78': DrsnaSestavljankaL78, '910': DrsnaSestavljankaL910 },
  'r': { '34': DrsnaSestavljankaR34, '56': DrsnaSestavljankaR56, '78': DrsnaSestavljankaR78, '910': DrsnaSestavljankaR910 },
  's': { '34': DrsnaSestavljankaS34, '56': DrsnaSestavljankaS56, '78': DrsnaSestavljankaS78, '910': DrsnaSestavljankaS910 },
  'š': { '34': DrsnaSestavljankaŠ34, '56': DrsnaSestavljankaŠ56, '78': DrsnaSestavljankaŠ78, '910': DrsnaSestavljankaŠ910 },
  'z': { '34': DrsnaSestavljankaZ34, '56': DrsnaSestavljankaZ56, '78': DrsnaSestavljankaZ78, '910': DrsnaSestavljankaZ910 },
  'ž': { '34': DrsnaSestavljankaŽ34, '56': DrsnaSestavljankaŽ56, '78': DrsnaSestavljankaŽ78, '910': DrsnaSestavljankaŽ910 },
};

// ============================================
// IGRA UJEMANJA KOMPONENTE
// ============================================
const IgraUjemanjaC = lazy(() => import('@/pages/IgraUjemanjaC'));
const IgraUjemanjaC56 = lazy(() => import('@/pages/IgraUjemanjaC56'));
const IgraUjemanjaC78 = lazy(() => import('@/pages/IgraUjemanjaC78'));
const IgraUjemanjaC910 = lazy(() => import('@/pages/IgraUjemanjaC910'));
const IgraUjemanjaČ = lazy(() => import('@/pages/IgraUjemanjaČ'));
const IgraUjemanjaČ56 = lazy(() => import('@/pages/IgraUjemanjaČ56'));
const IgraUjemanjaČ78 = lazy(() => import('@/pages/IgraUjemanjaČ78'));
const IgraUjemanjaČ910 = lazy(() => import('@/pages/IgraUjemanjaČ910'));
const IgraUjemanjaK = lazy(() => import('@/pages/IgraUjemanjaK'));
const IgraUjemanjaK56 = lazy(() => import('@/pages/IgraUjemanjaK56'));
const IgraUjemanjaK78 = lazy(() => import('@/pages/IgraUjemanjaK78'));
const IgraUjemanjaK910 = lazy(() => import('@/pages/IgraUjemanjaK910'));
const IgraUjemanjaL = lazy(() => import('@/pages/IgraUjemanjaL'));
const IgraUjemanjaL56 = lazy(() => import('@/pages/IgraUjemanjaL56'));
const IgraUjemanjaL78 = lazy(() => import('@/pages/IgraUjemanjaL78'));
const IgraUjemanjaL910 = lazy(() => import('@/pages/IgraUjemanjaL910'));
const IgraUjemanjaR = lazy(() => import('@/pages/IgraUjemanjaR'));
const IgraUjemanjaR56 = lazy(() => import('@/pages/IgraUjemanjaR56'));
const IgraUjemanjaR78 = lazy(() => import('@/pages/IgraUjemanjaR78'));
const IgraUjemanjaR910 = lazy(() => import('@/pages/IgraUjemanjaR910'));
const IgraUjemanjaS = lazy(() => import('@/pages/IgraUjemanjaS'));
const IgraUjemanjaS56 = lazy(() => import('@/pages/IgraUjemanjaS56'));
const IgraUjemanjaS78 = lazy(() => import('@/pages/IgraUjemanjaS78'));
const IgraUjemanjaS910 = lazy(() => import('@/pages/IgraUjemanjaS910'));
const IgraUjemanjaŠ = lazy(() => import('@/pages/IgraUjemanjaŠ'));
const IgraUjemanjaŠ56 = lazy(() => import('@/pages/IgraUjemanjaŠ56'));
const IgraUjemanjaŠ78 = lazy(() => import('@/pages/IgraUjemanjaŠ78'));
const IgraUjemanjaŠ910 = lazy(() => import('@/pages/IgraUjemanjaŠ910'));
const IgraUjemanjaZ = lazy(() => import('@/pages/IgraUjemanjaZ'));
const IgraUjemanjaZ56 = lazy(() => import('@/pages/IgraUjemanjaZ56'));
const IgraUjemanjaZ78 = lazy(() => import('@/pages/IgraUjemanjaZ78'));
const IgraUjemanjaZ910 = lazy(() => import('@/pages/IgraUjemanjaZ910'));
const IgraUjemanjaŽ = lazy(() => import('@/pages/IgraUjemanjaŽ'));
const IgraUjemanjaŽ56 = lazy(() => import('@/pages/IgraUjemanjaŽ56'));
const IgraUjemanjaŽ78 = lazy(() => import('@/pages/IgraUjemanjaŽ78'));
const IgraUjemanjaŽ910 = lazy(() => import('@/pages/IgraUjemanjaŽ910'));

const IGRA_UJEMANJA_BY_LETTER: Record<string, AgeGroupComponents> = {
  'c': { base: IgraUjemanjaC, '56': IgraUjemanjaC56, '78': IgraUjemanjaC78, '910': IgraUjemanjaC910 },
  'č': { base: IgraUjemanjaČ, '56': IgraUjemanjaČ56, '78': IgraUjemanjaČ78, '910': IgraUjemanjaČ910 },
  'k': { base: IgraUjemanjaK, '56': IgraUjemanjaK56, '78': IgraUjemanjaK78, '910': IgraUjemanjaK910 },
  'l': { base: IgraUjemanjaL, '56': IgraUjemanjaL56, '78': IgraUjemanjaL78, '910': IgraUjemanjaL910 },
  'r': { base: IgraUjemanjaR, '56': IgraUjemanjaR56, '78': IgraUjemanjaR78, '910': IgraUjemanjaR910 },
  's': { base: IgraUjemanjaS, '56': IgraUjemanjaS56, '78': IgraUjemanjaS78, '910': IgraUjemanjaS910 },
  'š': { base: IgraUjemanjaŠ, '56': IgraUjemanjaŠ56, '78': IgraUjemanjaŠ78, '910': IgraUjemanjaŠ910 },
  'z': { base: IgraUjemanjaZ, '56': IgraUjemanjaZ56, '78': IgraUjemanjaZ78, '910': IgraUjemanjaZ910 },
  'ž': { base: IgraUjemanjaŽ, '56': IgraUjemanjaŽ56, '78': IgraUjemanjaŽ78, '910': IgraUjemanjaŽ910 },
};

// ============================================
// DYNAMIC ROUTER COMPONENTS
// ============================================

/**
 * Spomin Router - handles /govorne-igre/spomin/spomin-:letter
 */
export function SpominRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/govorne-igre/spomin" replace />;
  }
  
  // Extract letter from "spomin-X" format
  const letterMatch = letter.match(/^spomin-(.+)$/i);
  const actualLetter = letterMatch ? letterMatch[1] : letter;
  
  const normalizedLetter = normalizeLetterParam(actualLetter);
  const Component = SPOMIN_COMPONENTS[normalizedLetter];
  
  if (!Component) {
    console.warn(`Spomin component not found for letter: ${letter} (normalized: ${normalizedLetter})`);
    return <Navigate to="/govorne-igre/spomin" replace />;
  }
  
  return (
    <ProtectedRoute>
      <Suspense fallback={<GameLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
}

/**
 * Sestavljanke Router - handles /govorne-igre/sestavljanke/:letterAndAge
 */
export function SestavljankeRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    return <Navigate to="/govorne-igre/sestavljanke" replace />;
  }
  
  const normalized = normalizeLetterParam(letterAndAge);
  
  // Extract age group suffix (56, 78, 910) if present
  const ageMatch = normalized.match(/^(.+?)(56|78|910)$/);
  const letter = ageMatch ? ageMatch[1] : normalized;
  const ageGroup = ageMatch ? ageMatch[2] as '56' | '78' | '910' : 'base';
  
  const letterComponents = SESTAVLJANKE_BY_LETTER[letter];
  if (!letterComponents) {
    console.warn(`Sestavljanke components not found for letter: ${letterAndAge} (normalized letter: ${letter})`);
    return <Navigate to="/govorne-igre/sestavljanke" replace />;
  }
  
  const Component = letterComponents[ageGroup];
  if (!Component) {
    console.warn(`Sestavljanke component not found for age group: ${ageGroup}`);
    return <Navigate to="/govorne-igre/sestavljanke" replace />;
  }
  
  return (
    <ProtectedRoute>
      <Suspense fallback={<GameLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
}

/**
 * Zaporedja Router - handles /govorne-igre/zaporedja/:letterAndAge
 */
export function ZaporedjaRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    return <Navigate to="/govorne-igre/zaporedja" replace />;
  }
  
  const normalized = normalizeLetterParam(letterAndAge);
  
  // Extract age group suffix
  const ageMatch = normalized.match(/^(.+?)(56|78|910)$/);
  const letter = ageMatch ? ageMatch[1] : normalized;
  const ageGroup = ageMatch ? ageMatch[2] as '56' | '78' | '910' : 'base';
  
  const letterComponents = ZAPOREDJA_BY_LETTER[letter];
  if (!letterComponents) {
    console.warn(`Zaporedja components not found for letter: ${letterAndAge} (normalized: ${letter})`);
    return <Navigate to="/govorne-igre/zaporedja" replace />;
  }
  
  const Component = letterComponents[ageGroup];
  if (!Component) {
    return <Navigate to="/govorne-igre/zaporedja" replace />;
  }
  
  return (
    <ProtectedRoute>
      <Suspense fallback={<GameLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
}

/**
 * Drsna Sestavljanka Router - handles /govorne-igre/drsna-sestavljanka/:letterAndAge
 */
export function DrsnaSestavljankaRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    return <Navigate to="/govorne-igre/drsna-sestavljanka" replace />;
  }
  
  const normalized = normalizeLetterParam(letterAndAge);
  
  // Extract age group suffix (34, 56, 78, 910)
  const ageMatch = normalized.match(/^(.+?)(34|56|78|910)$/);
  const letter = ageMatch ? ageMatch[1] : normalized;
  const ageGroup = ageMatch ? ageMatch[2] as '34' | '56' | '78' | '910' : '34';
  
  const letterComponents = DRSNA_BY_LETTER[letter];
  if (!letterComponents) {
    console.warn(`Drsna components not found for letter: ${letterAndAge} (normalized: ${letter})`);
    return <Navigate to="/govorne-igre/drsna-sestavljanka" replace />;
  }
  
  const Component = letterComponents[ageGroup];
  if (!Component) {
    return <Navigate to="/govorne-igre/drsna-sestavljanka" replace />;
  }
  
  return (
    <ProtectedRoute>
      <Suspense fallback={<GameLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
}

/**
 * Igra Ujemanja Router - handles /govorne-igre/igra-ujemanja/:letterAndAge
 */
export function IgraUjemanjaRouter() {
  const { letterAndAge } = useParams<{ letterAndAge: string }>();
  
  if (!letterAndAge) {
    return <Navigate to="/govorne-igre/igra-ujemanja" replace />;
  }
  
  const normalized = normalizeLetterParam(letterAndAge);
  
  // Extract age group suffix
  const ageMatch = normalized.match(/^(.+?)(56|78|910)$/);
  const letter = ageMatch ? ageMatch[1] : normalized;
  const ageGroup = ageMatch ? ageMatch[2] as '56' | '78' | '910' : 'base';
  
  const letterComponents = IGRA_UJEMANJA_BY_LETTER[letter];
  if (!letterComponents) {
    console.warn(`IgraUjemanja components not found for letter: ${letterAndAge} (normalized: ${letter})`);
    return <Navigate to="/govorne-igre/igra-ujemanja" replace />;
  }
  
  const Component = letterComponents[ageGroup];
  if (!Component) {
    return <Navigate to="/govorne-igre/igra-ujemanja" replace />;
  }
  
  return (
    <ProtectedRoute>
      <Suspense fallback={<GameLoader />}>
        <Component />
      </Suspense>
    </ProtectedRoute>
  );
}
