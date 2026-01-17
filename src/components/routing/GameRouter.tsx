/**
 * Simplified Game Router - uses generic game components instead of 150+ page imports
 * This dramatically reduces build time by eliminating static analysis of many import statements
 */
import { useParams, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SestavljankaGame } from '@/components/games/SestavljankaGame';
import { Suspense, lazy, ComponentType, useState, useEffect } from 'react';

// Loading component
function GameLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-4">Nalagam igro...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

// URL to internal letter mapping (ch->č, sh->š, zh->ž)
function urlToLetter(urlParam: string): string {
  const letterPart = urlParam.replace(/\d+$/, '').toLowerCase();
  const mapping: Record<string, string> = {
    'ch': 'č',
    'sh': 'š',
    'zh': 'ž',
  };
  return mapping[letterPart] || letterPart;
}

// Extract age group from URL param (e.g., 'ch910' -> '910', 'c' -> '')
function extractAgeGroup(urlParam: string): string {
  const match = urlParam.match(/(\d+)$/);
  return match ? match[1] : '';
}

// Validate letter
const VALID_LETTERS = ['c', 'č', 'k', 'l', 'r', 's', 'š', 'z', 'ž'];

function isValidLetter(letter: string): boolean {
  return VALID_LETTERS.includes(letter.toLowerCase());
}

// Sestavljanke Router - uses generic component
export function SestavljankeRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  
  const letter = urlToLetter(rawParam);
  const ageGroup = extractAgeGroup(rawParam);
  
  if (!isValidLetter(letter)) {
    return <Navigate to="/404" replace />;
  }
  
  return (
    <ProtectedRoute>
      <SestavljankaGame letter={letter} ageGroup={ageGroup} />
    </ProtectedRoute>
  );
}

// Component cache for lazy-loaded games
const componentCache = new Map<string, ComponentType<any>>();

// Generic lazy router for games that still use page components
interface LazyRouterConfig {
  basePath: string;
  getImportPath: (letter: string, ageGroup: string) => () => Promise<{ default: ComponentType<any> }>;
}

function createLazyRouter(config: LazyRouterConfig) {
  return function LazyRouter() {
    const { letterAndAge } = useParams();
    const rawParam = letterAndAge || '';
    const letter = urlToLetter(rawParam);
    const ageGroup = extractAgeGroup(rawParam);
    
    const [Component, setComponent] = useState<ComponentType<any> | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadComponent = async () => {
        setLoading(true);
        const cacheKey = `${config.basePath}-${letter}-${ageGroup}`;
        
        if (componentCache.has(cacheKey)) {
          setComponent(() => componentCache.get(cacheKey)!);
          setLoading(false);
          return;
        }
        
        try {
          const importFn = config.getImportPath(letter, ageGroup);
          const module = await importFn();
          componentCache.set(cacheKey, module.default);
          setComponent(() => module.default);
        } catch (err) {
          console.error('Failed to load game:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      
      if (isValidLetter(letter)) {
        loadComponent();
      } else {
        setError(true);
        setLoading(false);
      }
    }, [letter, ageGroup]);

    if (loading) return <GameLoading />;
    if (error || !Component) return <Navigate to="/404" replace />;

    return (
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    );
  };
}

// Helper to convert letter to filename format
function letterToFilename(letter: string): string {
  const map: Record<string, string> = {
    'č': 'Č',
    'š': 'Š',
    'ž': 'Ž',
  };
  return map[letter] || letter.toUpperCase();
}

// Zaporedja Router
export const ZaporedjaRouter = createLazyRouter({
  basePath: 'zaporedja',
  getImportPath: (letter, ageGroup) => {
    const suffix = ageGroup ? ageGroup : '';
    const L = letterToFilename(letter);
    return () => import(`../../pages/Zaporedja${L}${suffix}.tsx`);
  }
});

// Drsna Sestavljanka Router
export const DrsnaSestavljankaRouter = createLazyRouter({
  basePath: 'drsna',
  getImportPath: (letter, ageGroup) => {
    const L = letterToFilename(letter);
    return () => import(`../../pages/DrsnaSestavljanka${L}${ageGroup}.tsx`);
  }
});

// Igra Ujemanja Router
export const IgraUjemanjaRouter = createLazyRouter({
  basePath: 'ujemanja',
  getImportPath: (letter, ageGroup) => {
    const suffix = ageGroup ? ageGroup : '';
    const L = letterToFilename(letter);
    return () => import(`../../pages/IgraUjemanja${L}${suffix}.tsx`);
  }
});

// Spomin Router
export function SpominRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const letterPart = rawParam.replace('spomin-', '');
  const letter = urlToLetter(letterPart);
  
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      const cacheKey = `spomin-${letter}`;
      
      if (componentCache.has(cacheKey)) {
        setComponent(() => componentCache.get(cacheKey)!);
        setLoading(false);
        return;
      }
      
      try {
        const L = letterToFilename(letter);
        const module = await import(`../../pages/Spomin${L}.tsx`);
        componentCache.set(cacheKey, module.default);
        setComponent(() => module.default);
      } catch (err) {
        console.error('Failed to load Spomin game:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (isValidLetter(letter)) {
      loadComponent();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [letter]);

  if (loading) return <GameLoading />;
  if (error || !Component) return <Navigate to="/404" replace />;

  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}
