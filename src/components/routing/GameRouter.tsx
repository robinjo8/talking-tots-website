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

// Sestavljanke Router - uses generic component
export function SestavljankeRouter() {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  
  const letter = urlToLetter(rawParam);
  const ageGroup = extractAgeGroup(rawParam);
  
  // Validate letter
  const validLetters = ['c', 'č', 'k', 'l', 'r', 's', 'š', 'z', 'ž'];
  if (!validLetters.includes(letter)) {
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

// For games that still need individual page components (Spomin, Zaporedja, etc.)
// We use dynamic imports but with a much smaller map
const LAZY_IMPORT_MAPS: Record<string, Record<string, () => Promise<{ default: ComponentType<any> }>>> = {
  spomin: {
    'spomin-c': () => import('@/pages/SpominC'),
    'spomin-ch': () => import('@/pages/SpominČ'),
    'spomin-k': () => import('@/pages/SpominK'),
    'spomin-l': () => import('@/pages/SpominL'),
    'spomin-r': () => import('@/pages/SpominR'),
    'spomin-s': () => import('@/pages/SpominS'),
    'spomin-sh': () => import('@/pages/SpominŠ'),
    'spomin-z': () => import('@/pages/SpominZ'),
    'spomin-zh': () => import('@/pages/SpominŽ'),
  },
};

interface LazyGameRouterProps {
  gameType: string;
  paramName?: string;
}

function LazyGameRouter({ gameType, paramName = 'letterAndAge' }: LazyGameRouterProps) {
  const params = useParams();
  const rawParam = params[paramName] || '';
  const normalizedParam = rawParam.toLowerCase();
  
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      setError(null);
      
      const cacheKey = `${gameType}-${normalizedParam}`;
      
      if (componentCache.has(cacheKey)) {
        setComponent(() => componentCache.get(cacheKey)!);
        setLoading(false);
        return;
      }
      
      const importMap = LAZY_IMPORT_MAPS[gameType];
      if (!importMap) {
        setError(`Unknown game type: ${gameType}`);
        setLoading(false);
        return;
      }
      
      const importFn = importMap[normalizedParam];
      if (!importFn) {
        console.error(`No component found for ${gameType}/${normalizedParam}`);
        setError(`Game not found: ${rawParam}`);
        setLoading(false);
        return;
      }
      
      try {
        const module = await importFn();
        componentCache.set(cacheKey, module.default);
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load component:`, err);
        setError(`Failed to load game`);
      } finally {
        setLoading(false);
      }
    };
    
    loadComponent();
  }, [gameType, normalizedParam, rawParam]);

  if (loading) return <GameLoading />;
  if (error) return <Navigate to="/404" replace />;
  if (!Component) return <Navigate to="/404" replace />;

  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

// Pre-configured routers
export function SpominRouter() {
  return <LazyGameRouter gameType="spomin" />;
}

// Zaporedja, DrsnaSestavljanka, IgraUjemanja still use page components for now
// TODO: Convert these to generic components as well

// Temporary: Keep lazy loading for other game types until they're converted
const ZAPOREDJA_IMPORTS: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  'c': () => import('@/pages/ZaporedjaC'),
  'c56': () => import('@/pages/ZaporedjaC56'),
  'c78': () => import('@/pages/ZaporedjaC78'),
  'c910': () => import('@/pages/ZaporedjaC910'),
  'ch': () => import('@/pages/ZaporedjaČ'),
  'ch56': () => import('@/pages/ZaporedjaČ56'),
  'ch78': () => import('@/pages/ZaporedjaČ78'),
  'ch910': () => import('@/pages/ZaporedjaČ910'),
  'k': () => import('@/pages/ZaporedjaK'),
  'k56': () => import('@/pages/ZaporedjaK56'),
  'k78': () => import('@/pages/ZaporedjaK78'),
  'k910': () => import('@/pages/ZaporedjaK910'),
  'l': () => import('@/pages/ZaporedjaL'),
  'l56': () => import('@/pages/ZaporedjaL56'),
  'l78': () => import('@/pages/ZaporedjaL78'),
  'l910': () => import('@/pages/ZaporedjaL910'),
  'r': () => import('@/pages/ZaporedjaR'),
  'r56': () => import('@/pages/ZaporedjaR56'),
  'r78': () => import('@/pages/ZaporedjaR78'),
  'r910': () => import('@/pages/ZaporedjaR910'),
  's': () => import('@/pages/ZaporedjaS'),
  's56': () => import('@/pages/ZaporedjaS56'),
  's78': () => import('@/pages/ZaporedjaS78'),
  's910': () => import('@/pages/ZaporedjaS910'),
  'sh': () => import('@/pages/ZaporedjaŠ'),
  'sh56': () => import('@/pages/ZaporedjaŠ56'),
  'sh78': () => import('@/pages/ZaporedjaŠ78'),
  'sh910': () => import('@/pages/ZaporedjaŠ910'),
  'z': () => import('@/pages/ZaporedjaZ'),
  'z56': () => import('@/pages/ZaporedjaZ56'),
  'z78': () => import('@/pages/ZaporedjaZ78'),
  'z910': () => import('@/pages/ZaporedjaZ910'),
  'zh': () => import('@/pages/ZaporedjaŽ'),
  'zh56': () => import('@/pages/ZaporedjaŽ56'),
  'zh78': () => import('@/pages/ZaporedjaŽ78'),
  'zh910': () => import('@/pages/ZaporedjaŽ910'),
};

const DRSNA_IMPORTS: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  'c34': () => import('@/pages/DrsnaSestavljankaC34'),
  'c56': () => import('@/pages/DrsnaSestavljankaC56'),
  'c78': () => import('@/pages/DrsnaSestavljankaC78'),
  'c910': () => import('@/pages/DrsnaSestavljankaC910'),
  'ch34': () => import('@/pages/DrsnaSestavljankaČ34'),
  'ch56': () => import('@/pages/DrsnaSestavljankaČ56'),
  'ch78': () => import('@/pages/DrsnaSestavljankaČ78'),
  'ch910': () => import('@/pages/DrsnaSestavljankaČ910'),
  'k34': () => import('@/pages/DrsnaSestavljankaK34'),
  'k56': () => import('@/pages/DrsnaSestavljankaK56'),
  'k78': () => import('@/pages/DrsnaSestavljankaK78'),
  'k910': () => import('@/pages/DrsnaSestavljankaK910'),
  'l34': () => import('@/pages/DrsnaSestavljankaL34'),
  'l56': () => import('@/pages/DrsnaSestavljankaL56'),
  'l78': () => import('@/pages/DrsnaSestavljankaL78'),
  'l910': () => import('@/pages/DrsnaSestavljankaL910'),
  'r34': () => import('@/pages/DrsnaSestavljankaR34'),
  'r56': () => import('@/pages/DrsnaSestavljankaR56'),
  'r78': () => import('@/pages/DrsnaSestavljankaR78'),
  'r910': () => import('@/pages/DrsnaSestavljankaR910'),
  's34': () => import('@/pages/DrsnaSestavljankaS34'),
  's56': () => import('@/pages/DrsnaSestavljankaS56'),
  's78': () => import('@/pages/DrsnaSestavljankaS78'),
  's910': () => import('@/pages/DrsnaSestavljankaS910'),
  'sh34': () => import('@/pages/DrsnaSestavljankaŠ34'),
  'sh56': () => import('@/pages/DrsnaSestavljankaŠ56'),
  'sh78': () => import('@/pages/DrsnaSestavljankaŠ78'),
  'sh910': () => import('@/pages/DrsnaSestavljankaŠ910'),
  'z34': () => import('@/pages/DrsnaSestavljankaZ34'),
  'z56': () => import('@/pages/DrsnaSestavljankaZ56'),
  'z78': () => import('@/pages/DrsnaSestavljankaZ78'),
  'z910': () => import('@/pages/DrsnaSestavljankaZ910'),
  'zh34': () => import('@/pages/DrsnaSestavljankaŽ34'),
  'zh56': () => import('@/pages/DrsnaSestavljankaŽ56'),
  'zh78': () => import('@/pages/DrsnaSestavljankaŽ78'),
  'zh910': () => import('@/pages/DrsnaSestavljankaŽ910'),
};

const UJEMANJA_IMPORTS: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  'c': () => import('@/pages/IgraUjemanjaC'),
  'c56': () => import('@/pages/IgraUjemanjaC56'),
  'c78': () => import('@/pages/IgraUjemanjaC78'),
  'c910': () => import('@/pages/IgraUjemanjaC910'),
  'ch': () => import('@/pages/IgraUjemanjaČ'),
  'ch56': () => import('@/pages/IgraUjemanjaČ56'),
  'ch78': () => import('@/pages/IgraUjemanjaČ78'),
  'ch910': () => import('@/pages/IgraUjemanjaČ910'),
  'k': () => import('@/pages/IgraUjemanjaK'),
  'k56': () => import('@/pages/IgraUjemanjaK56'),
  'k78': () => import('@/pages/IgraUjemanjaK78'),
  'k910': () => import('@/pages/IgraUjemanjaK910'),
  'l': () => import('@/pages/IgraUjemanjaL'),
  'l56': () => import('@/pages/IgraUjemanjaL56'),
  'l78': () => import('@/pages/IgraUjemanjaL78'),
  'l910': () => import('@/pages/IgraUjemanjaL910'),
  'r': () => import('@/pages/IgraUjemanjaR'),
  'r56': () => import('@/pages/IgraUjemanjaR56'),
  'r78': () => import('@/pages/IgraUjemanjaR78'),
  'r910': () => import('@/pages/IgraUjemanjaR910'),
  's': () => import('@/pages/IgraUjemanjaS'),
  's56': () => import('@/pages/IgraUjemanjaS56'),
  's78': () => import('@/pages/IgraUjemanjaS78'),
  's910': () => import('@/pages/IgraUjemanjaS910'),
  'sh': () => import('@/pages/IgraUjemanjaŠ'),
  'sh56': () => import('@/pages/IgraUjemanjaŠ56'),
  'sh78': () => import('@/pages/IgraUjemanjaŠ78'),
  'sh910': () => import('@/pages/IgraUjemanjaŠ910'),
  'z': () => import('@/pages/IgraUjemanjaZ'),
  'z56': () => import('@/pages/IgraUjemanjaZ56'),
  'z78': () => import('@/pages/IgraUjemanjaZ78'),
  'z910': () => import('@/pages/IgraUjemanjaZ910'),
  'zh': () => import('@/pages/IgraUjemanjaŽ'),
  'zh56': () => import('@/pages/IgraUjemanjaŽ56'),
  'zh78': () => import('@/pages/IgraUjemanjaŽ78'),
  'zh910': () => import('@/pages/IgraUjemanjaŽ910'),
};

function GenericLazyRouter({ importMap }: { importMap: Record<string, () => Promise<{ default: ComponentType<any> }>> }) {
  const { letterAndAge } = useParams();
  const rawParam = letterAndAge || '';
  const normalizedParam = rawParam.toLowerCase();
  
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      setError(null);
      
      const importFn = importMap[normalizedParam];
      if (!importFn) {
        console.error(`No component found for ${normalizedParam}. Available: ${Object.keys(importMap).join(', ')}`);
        setError(`Game not found`);
        setLoading(false);
        return;
      }
      
      try {
        const module = await importFn();
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load component:`, err);
        setError(`Failed to load game`);
      } finally {
        setLoading(false);
      }
    };
    
    loadComponent();
  }, [normalizedParam, importMap]);

  if (loading) return <GameLoading />;
  if (error) return <Navigate to="/404" replace />;
  if (!Component) return <Navigate to="/404" replace />;

  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

export function ZaporedjaRouter() {
  return <GenericLazyRouter importMap={ZAPOREDJA_IMPORTS} />;
}

export function DrsnaSestavljankaRouter() {
  return <GenericLazyRouter importMap={DRSNA_IMPORTS} />;
}

export function IgraUjemanjaRouter() {
  return <GenericLazyRouter importMap={UJEMANJA_IMPORTS} />;
}
