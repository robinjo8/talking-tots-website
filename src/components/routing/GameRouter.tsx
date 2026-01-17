/**
 * Dynamic Game Router - handles URL decoding and component loading
 * Solves build timeout by moving lazy imports to runtime
 */
import { useState, useEffect, Suspense, lazy, ComponentType } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

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

// Normalize key for consistent matching (handles č, š, ž)
function normalizeKey(key: string): string {
  return decodeURIComponent(key).normalize('NFC').toLowerCase();
}

// Component cache to avoid re-importing
const componentCache = new Map<string, ComponentType<any>>();

interface GameRouterProps {
  gameType: 'sestavljanke' | 'zaporedja' | 'drsna-sestavljanka' | 'igra-ujemanja' | 'spomin';
  paramName?: string;
}

// Import maps for each game type
const IMPORT_MAPS: Record<string, Record<string, () => Promise<{ default: ComponentType<any> }>>> = {
  sestavljanke: {
    'c': () => import('@/pages/SestavljankeC'),
    'c56': () => import('@/pages/SestavljankeC56'),
    'c78': () => import('@/pages/SestavljankeC78'),
    'c910': () => import('@/pages/SestavljankeC910'),
    'ch': () => import('@/pages/SestavljankeČ'),
    'ch56': () => import('@/pages/SestavljankeČ56'),
    'ch78': () => import('@/pages/SestavljankeČ78'),
    'ch910': () => import('@/pages/SestavljankeČ910'),
    'k': () => import('@/pages/SestavljankeK'),
    'k56': () => import('@/pages/SestavljankeK56'),
    'k78': () => import('@/pages/SestavljankeK78'),
    'k910': () => import('@/pages/SestavljankeK910'),
    'l': () => import('@/pages/SestavljankeL'),
    'l56': () => import('@/pages/SestavljankeL56'),
    'l78': () => import('@/pages/SestavljankeL78'),
    'l910': () => import('@/pages/SestavljankeL910'),
    'r': () => import('@/pages/SestavljankeR'),
    'r56': () => import('@/pages/SestavljankeR56'),
    'r78': () => import('@/pages/SestavljankeR78'),
    'r910': () => import('@/pages/SestavljankeR910'),
    's': () => import('@/pages/SestavljankeS'),
    's56': () => import('@/pages/SestavljankeS56'),
    's78': () => import('@/pages/SestavljankeS78'),
    's910': () => import('@/pages/SestavljankeS910'),
    'sh': () => import('@/pages/SestavljankeŠ'),
    'sh56': () => import('@/pages/SestavljankeŠ56'),
    'sh78': () => import('@/pages/SestavljankeŠ78'),
    'sh910': () => import('@/pages/SestavljankeŠ910'),
    'z': () => import('@/pages/SestavljankeZ'),
    'z56': () => import('@/pages/SestavljankeZ56'),
    'z78': () => import('@/pages/SestavljankeZ78'),
    'z910': () => import('@/pages/SestavljankeZ910'),
    'zh': () => import('@/pages/SestavljankeŽ'),
    'zh56': () => import('@/pages/SestavljankeŽ56'),
    'zh78': () => import('@/pages/SestavljankeŽ78'),
    'zh910': () => import('@/pages/SestavljankeŽ910'),
  },
  zaporedja: {
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
  },
  'drsna-sestavljanka': {
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
  },
  'igra-ujemanja': {
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
  },
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

export function GameRouter({ gameType, paramName = 'letterAndAge' }: GameRouterProps) {
  const params = useParams();
  const rawParam = params[paramName] || '';
  const normalizedParam = normalizeKey(rawParam);
  
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      setError(null);
      
      const cacheKey = `${gameType}-${normalizedParam}`;
      
      // Check cache first
      if (componentCache.has(cacheKey)) {
        setComponent(() => componentCache.get(cacheKey)!);
        setLoading(false);
        return;
      }
      
      const importMap = IMPORT_MAPS[gameType];
      if (!importMap) {
        setError(`Unknown game type: ${gameType}`);
        setLoading(false);
        return;
      }
      
      const importFn = importMap[normalizedParam];
      if (!importFn) {
        console.error(`No component found for ${gameType}/${normalizedParam}. Available: ${Object.keys(importMap).join(', ')}`);
        setError(`Game not found: ${rawParam}`);
        setLoading(false);
        return;
      }
      
      try {
        const module = await importFn();
        componentCache.set(cacheKey, module.default);
        setComponent(() => module.default);
      } catch (err) {
        console.error(`Failed to load component for ${gameType}/${normalizedParam}:`, err);
        setError(`Failed to load game`);
      } finally {
        setLoading(false);
      }
    };
    
    loadComponent();
  }, [gameType, normalizedParam, rawParam]);

  if (loading) {
    return <GameLoading />;
  }

  if (error) {
    return <Navigate to="/404" replace />;
  }

  if (!Component) {
    return <Navigate to="/404" replace />;
  }

  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

// Pre-configured routers for each game type
export function SestavljankeRouter() {
  return <GameRouter gameType="sestavljanke" />;
}

export function ZaporedjaRouter() {
  return <GameRouter gameType="zaporedja" />;
}

export function DrsnaSestavljankaRouter() {
  return <GameRouter gameType="drsna-sestavljanka" />;
}

export function IgraUjemanjaRouter() {
  return <GameRouter gameType="igra-ujemanja" />;
}

export function SpominRouter() {
  return <GameRouter gameType="spomin" />;
}
