/**
 * Dinamično generirane game route
 * 
 * Namesto dinamičnih importov, ki ne delujejo s posebnimi znaki (Č, Š, Ž),
 * uporabljamo eksplicitno mapo komponent.
 */
import { lazy, ComponentType } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  SUPPORTED_LETTERS, 
  GAME_CONFIGS, 
  letterToComponentName,
  LEGACY_GAME_ROUTES,
  type AgeGroup
} from './routeConfig';

// ============================================
// EKSPLICITNI LAZY IMPORTI ZA VSE KOMPONENTE
// ============================================

// Main game pages
const SpominGames = lazy(() => import('@/pages/SpominGames'));
const SestavljankeGames = lazy(() => import('@/pages/SestavljankeGames'));
const Zaporedja = lazy(() => import('@/pages/Zaporedja'));
const DrsnaSestavljanka = lazy(() => import('@/pages/DrsnaSestavljanka'));
const IgraUjemanja = lazy(() => import('@/pages/IgraUjemanja'));
const Labirint = lazy(() => import('@/pages/Labirint'));
const LabirintLetter = lazy(() => import('@/pages/LabirintLetter'));
const GovorneIgre = lazy(() => import('@/pages/GovorneIgre'));

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
  'SpominC': SpominC,
  'SpominČ': SpominČ,
  'SpominK': SpominK,
  'SpominL': SpominL,
  'SpominR': SpominR,
  'SpominS': SpominS,
  'SpominŠ': SpominŠ,
  'SpominZ': SpominZ,
  'SpominŽ': SpominŽ,
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

const SESTAVLJANKE_COMPONENTS: Record<string, ComponentType<any>> = {
  'SestavljankeC': SestavljankeC, 'SestavljankeC56': SestavljankeC56, 'SestavljankeC78': SestavljankeC78, 'SestavljankeC910': SestavljankeC910,
  'SestavljankeČ': SestavljankeČ, 'SestavljankeČ56': SestavljankeČ56, 'SestavljankeČ78': SestavljankeČ78, 'SestavljankeČ910': SestavljankeČ910,
  'SestavljankeK': SestavljankeK, 'SestavljankeK56': SestavljankeK56, 'SestavljankeK78': SestavljankeK78, 'SestavljankeK910': SestavljankeK910,
  'SestavljankeL': SestavljankeL, 'SestavljankeL56': SestavljankeL56, 'SestavljankeL78': SestavljankeL78, 'SestavljankeL910': SestavljankeL910,
  'SestavljankeR': SestavljankeR, 'SestavljankeR56': SestavljankeR56, 'SestavljankeR78': SestavljankeR78, 'SestavljankeR910': SestavljankeR910,
  'SestavljankeS': SestavljankeS, 'SestavljankeS56': SestavljankeS56, 'SestavljankeS78': SestavljankeS78, 'SestavljankeS910': SestavljankeS910,
  'SestavljankeŠ': SestavljankeŠ, 'SestavljankeŠ56': SestavljankeŠ56, 'SestavljankeŠ78': SestavljankeŠ78, 'SestavljankeŠ910': SestavljankeŠ910,
  'SestavljankeZ': SestavljankeZ, 'SestavljankeZ56': SestavljankeZ56, 'SestavljankeZ78': SestavljankeZ78, 'SestavljankeZ910': SestavljankeZ910,
  'SestavljankeŽ': SestavljankeŽ, 'SestavljankeŽ56': SestavljankeŽ56, 'SestavljankeŽ78': SestavljankeŽ78, 'SestavljankeŽ910': SestavljankeŽ910,
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

const ZAPOREDJA_COMPONENTS: Record<string, ComponentType<any>> = {
  'ZaporedjaC': ZaporedjaC, 'ZaporedjaC56': ZaporedjaC56, 'ZaporedjaC78': ZaporedjaC78, 'ZaporedjaC910': ZaporedjaC910,
  'ZaporedjaČ': ZaporedjaČ, 'ZaporedjaČ56': ZaporedjaČ56, 'ZaporedjaČ78': ZaporedjaČ78, 'ZaporedjaČ910': ZaporedjaČ910,
  'ZaporedjaK': ZaporedjaK, 'ZaporedjaK56': ZaporedjaK56, 'ZaporedjaK78': ZaporedjaK78, 'ZaporedjaK910': ZaporedjaK910,
  'ZaporedjaL': ZaporedjaL, 'ZaporedjaL56': ZaporedjaL56, 'ZaporedjaL78': ZaporedjaL78, 'ZaporedjaL910': ZaporedjaL910,
  'ZaporedjaR': ZaporedjaR, 'ZaporedjaR56': ZaporedjaR56, 'ZaporedjaR78': ZaporedjaR78, 'ZaporedjaR910': ZaporedjaR910,
  'ZaporedjaS': ZaporedjaS, 'ZaporedjaS56': ZaporedjaS56, 'ZaporedjaS78': ZaporedjaS78, 'ZaporedjaS910': ZaporedjaS910,
  'ZaporedjaŠ': ZaporedjaŠ, 'ZaporedjaŠ56': ZaporedjaŠ56, 'ZaporedjaŠ78': ZaporedjaŠ78, 'ZaporedjaŠ910': ZaporedjaŠ910,
  'ZaporedjaZ': ZaporedjaZ, 'ZaporedjaZ56': ZaporedjaZ56, 'ZaporedjaZ78': ZaporedjaZ78, 'ZaporedjaZ910': ZaporedjaZ910,
  'ZaporedjaŽ': ZaporedjaŽ, 'ZaporedjaŽ56': ZaporedjaŽ56, 'ZaporedjaŽ78': ZaporedjaŽ78, 'ZaporedjaŽ910': ZaporedjaŽ910,
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

const DRSNA_COMPONENTS: Record<string, ComponentType<any>> = {
  'DrsnaSestavljankaC34': DrsnaSestavljankaC34, 'DrsnaSestavljankaC56': DrsnaSestavljankaC56, 'DrsnaSestavljankaC78': DrsnaSestavljankaC78, 'DrsnaSestavljankaC910': DrsnaSestavljankaC910,
  'DrsnaSestavljankaČ34': DrsnaSestavljankaČ34, 'DrsnaSestavljankaČ56': DrsnaSestavljankaČ56, 'DrsnaSestavljankaČ78': DrsnaSestavljankaČ78, 'DrsnaSestavljankaČ910': DrsnaSestavljankaČ910,
  'DrsnaSestavljankaK34': DrsnaSestavljankaK34, 'DrsnaSestavljankaK56': DrsnaSestavljankaK56, 'DrsnaSestavljankaK78': DrsnaSestavljankaK78, 'DrsnaSestavljankaK910': DrsnaSestavljankaK910,
  'DrsnaSestavljankaL34': DrsnaSestavljankaL34, 'DrsnaSestavljankaL56': DrsnaSestavljankaL56, 'DrsnaSestavljankaL78': DrsnaSestavljankaL78, 'DrsnaSestavljankaL910': DrsnaSestavljankaL910,
  'DrsnaSestavljankaR34': DrsnaSestavljankaR34, 'DrsnaSestavljankaR56': DrsnaSestavljankaR56, 'DrsnaSestavljankaR78': DrsnaSestavljankaR78, 'DrsnaSestavljankaR910': DrsnaSestavljankaR910,
  'DrsnaSestavljankaS34': DrsnaSestavljankaS34, 'DrsnaSestavljankaS56': DrsnaSestavljankaS56, 'DrsnaSestavljankaS78': DrsnaSestavljankaS78, 'DrsnaSestavljankaS910': DrsnaSestavljankaS910,
  'DrsnaSestavljankaŠ34': DrsnaSestavljankaŠ34, 'DrsnaSestavljankaŠ56': DrsnaSestavljankaŠ56, 'DrsnaSestavljankaŠ78': DrsnaSestavljankaŠ78, 'DrsnaSestavljankaŠ910': DrsnaSestavljankaŠ910,
  'DrsnaSestavljankaZ34': DrsnaSestavljankaZ34, 'DrsnaSestavljankaZ56': DrsnaSestavljankaZ56, 'DrsnaSestavljankaZ78': DrsnaSestavljankaZ78, 'DrsnaSestavljankaZ910': DrsnaSestavljankaZ910,
  'DrsnaSestavljankaŽ34': DrsnaSestavljankaŽ34, 'DrsnaSestavljankaŽ56': DrsnaSestavljankaŽ56, 'DrsnaSestavljankaŽ78': DrsnaSestavljankaŽ78, 'DrsnaSestavljankaŽ910': DrsnaSestavljankaŽ910,
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

const IGRA_UJEMANJA_COMPONENTS: Record<string, ComponentType<any>> = {
  'IgraUjemanjaC': IgraUjemanjaC, 'IgraUjemanjaC56': IgraUjemanjaC56, 'IgraUjemanjaC78': IgraUjemanjaC78, 'IgraUjemanjaC910': IgraUjemanjaC910,
  'IgraUjemanjaČ': IgraUjemanjaČ, 'IgraUjemanjaČ56': IgraUjemanjaČ56, 'IgraUjemanjaČ78': IgraUjemanjaČ78, 'IgraUjemanjaČ910': IgraUjemanjaČ910,
  'IgraUjemanjaK': IgraUjemanjaK, 'IgraUjemanjaK56': IgraUjemanjaK56, 'IgraUjemanjaK78': IgraUjemanjaK78, 'IgraUjemanjaK910': IgraUjemanjaK910,
  'IgraUjemanjaL': IgraUjemanjaL, 'IgraUjemanjaL56': IgraUjemanjaL56, 'IgraUjemanjaL78': IgraUjemanjaL78, 'IgraUjemanjaL910': IgraUjemanjaL910,
  'IgraUjemanjaR': IgraUjemanjaR, 'IgraUjemanjaR56': IgraUjemanjaR56, 'IgraUjemanjaR78': IgraUjemanjaR78, 'IgraUjemanjaR910': IgraUjemanjaR910,
  'IgraUjemanjaS': IgraUjemanjaS, 'IgraUjemanjaS56': IgraUjemanjaS56, 'IgraUjemanjaS78': IgraUjemanjaS78, 'IgraUjemanjaS910': IgraUjemanjaS910,
  'IgraUjemanjaŠ': IgraUjemanjaŠ, 'IgraUjemanjaŠ56': IgraUjemanjaŠ56, 'IgraUjemanjaŠ78': IgraUjemanjaŠ78, 'IgraUjemanjaŠ910': IgraUjemanjaŠ910,
  'IgraUjemanjaZ': IgraUjemanjaZ, 'IgraUjemanjaZ56': IgraUjemanjaZ56, 'IgraUjemanjaZ78': IgraUjemanjaZ78, 'IgraUjemanjaZ910': IgraUjemanjaZ910,
  'IgraUjemanjaŽ': IgraUjemanjaŽ, 'IgraUjemanjaŽ56': IgraUjemanjaŽ56, 'IgraUjemanjaŽ78': IgraUjemanjaŽ78, 'IgraUjemanjaŽ910': IgraUjemanjaŽ910,
};

// ============================================
// CENTRALNA MAPA VSEH KOMPONENT
// ============================================
const ALL_COMPONENTS: Record<string, ComponentType<any>> = {
  ...SPOMIN_COMPONENTS,
  ...SESTAVLJANKE_COMPONENTS,
  ...ZAPOREDJA_COMPONENTS,
  ...DRSNA_COMPONENTS,
  ...IGRA_UJEMANJA_COMPONENTS,
};

// Helper za pridobitev komponente
const getComponent = (componentName: string): ComponentType<any> | null => {
  return ALL_COMPONENTS[componentName] || null;
};

// Helper za URL-enkodirane poti (šumniki)
const ENCODED_LETTERS: Record<string, string> = {
  'č': '%C4%8D',
  'š': '%C5%A1',
  'ž': '%C5%BE',
};

const getEncodedLetter = (letter: string): string | null => {
  return ENCODED_LETTERS[letter] || null;
};

// ============================================
// GENERATORJI ROUTOV
// ============================================

function generateSpominRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.spomin;
  
  routes.push(
    <Route key="spomin-main" path={config.basePath} element={<ProtectedRoute><SpominGames /></ProtectedRoute>} />
  );
  
  SUPPORTED_LETTERS.forEach(letter => {
    const componentName = `Spomin${letterToComponentName(letter)}`;
    const Component = getComponent(componentName);
    if (Component) {
      routes.push(
        <Route key={`spomin-${letter}`} path={`${config.basePath}/spomin-${letter}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
      );
      // Dodatna pot za URL-enkodirane šumnike
      const encodedLetter = getEncodedLetter(letter);
      if (encodedLetter) {
        routes.push(
          <Route key={`spomin-${letter}-encoded`} path={`${config.basePath}/spomin-${encodedLetter}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
        );
      }
    }
  });
  
  return routes;
}

function generateSestavljankeRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.sestavljanke;
  
  routes.push(
    <Route key="sestavljanke-main" path={config.basePath} element={<ProtectedRoute><SestavljankeGames /></ProtectedRoute>} />
  );
  
  SUPPORTED_LETTERS.forEach(letter => {
    const letterName = letterToComponentName(letter);
    const encodedLetter = getEncodedLetter(letter);
    
    // Base route (3-4 leta)
    const baseComponentName = `Sestavljanke${letterName}`;
    const BaseComponent = getComponent(baseComponentName);
    if (BaseComponent) {
      routes.push(
        <Route key={`sestavljanke-${letter}`} path={`${config.basePath}/${letter}`} element={<ProtectedRoute><BaseComponent /></ProtectedRoute>} />
      );
      // Enkodirana pot za šumnike
      if (encodedLetter) {
        routes.push(
          <Route key={`sestavljanke-${letter}-encoded`} path={`${config.basePath}/${encodedLetter}`} element={<ProtectedRoute><BaseComponent /></ProtectedRoute>} />
        );
      }
    }
    
    // Age groups
    const ageGroups: AgeGroup[] = ['56', '78', '910'];
    ageGroups.forEach(ageGroup => {
      const componentName = `Sestavljanke${letterName}${ageGroup}`;
      const Component = getComponent(componentName);
      if (Component) {
        routes.push(
          <Route key={`sestavljanke-${letter}-${ageGroup}`} path={`${config.basePath}/${letter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
        );
        // Enkodirana pot za šumnike
        if (encodedLetter) {
          routes.push(
            <Route key={`sestavljanke-${letter}-${ageGroup}-encoded`} path={`${config.basePath}/${encodedLetter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
          );
        }
      }
    });
  });
  
  return routes;
}

function generateZaporedjaRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.zaporedja;
  
  routes.push(
    <Route key="zaporedja-main" path={config.basePath} element={<ProtectedRoute><Zaporedja /></ProtectedRoute>} />
  );
  
  SUPPORTED_LETTERS.forEach(letter => {
    const letterName = letterToComponentName(letter);
    const encodedLetter = getEncodedLetter(letter);
    
    // Base route
    const baseComponentName = `Zaporedja${letterName}`;
    const BaseComponent = getComponent(baseComponentName);
    if (BaseComponent) {
      routes.push(
        <Route key={`zaporedja-${letter}`} path={`${config.basePath}/${letter}`} element={<ProtectedRoute><BaseComponent /></ProtectedRoute>} />
      );
      if (encodedLetter) {
        routes.push(
          <Route key={`zaporedja-${letter}-encoded`} path={`${config.basePath}/${encodedLetter}`} element={<ProtectedRoute><BaseComponent /></ProtectedRoute>} />
        );
      }
    }
    
    // Age groups
    const ageGroups: AgeGroup[] = ['56', '78', '910'];
    ageGroups.forEach(ageGroup => {
      const componentName = `Zaporedja${letterName}${ageGroup}`;
      const Component = getComponent(componentName);
      if (Component) {
        routes.push(
          <Route key={`zaporedja-${letter}-${ageGroup}`} path={`${config.basePath}/${letter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
        );
        if (encodedLetter) {
          routes.push(
            <Route key={`zaporedja-${letter}-${ageGroup}-encoded`} path={`${config.basePath}/${encodedLetter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
          );
        }
      }
    });
  });
  
  return routes;
}

function generateDrsnaSestavljankaRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.drsnaSestavljanka;
  
  routes.push(
    <Route key="drsna-main" path={config.basePath} element={<ProtectedRoute><DrsnaSestavljanka /></ProtectedRoute>} />
  );
  
  const ageGroups: AgeGroup[] = ['34', '56', '78', '910'];
  SUPPORTED_LETTERS.forEach(letter => {
    const letterName = letterToComponentName(letter);
    const encodedLetter = getEncodedLetter(letter);
    ageGroups.forEach(ageGroup => {
      const componentName = `DrsnaSestavljanka${letterName}${ageGroup}`;
      const Component = getComponent(componentName);
      if (Component) {
        routes.push(
          <Route key={`drsna-${letter}-${ageGroup}`} path={`${config.basePath}/${letter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
        );
        if (encodedLetter) {
          routes.push(
            <Route key={`drsna-${letter}-${ageGroup}-encoded`} path={`${config.basePath}/${encodedLetter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
          );
        }
      }
    });
  });
  
  return routes;
}

function generateIgraUjemanjaRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.igraUjemanja;
  
  routes.push(
    <Route key="ujemanja-main" path={config.basePath} element={<ProtectedRoute><IgraUjemanja /></ProtectedRoute>} />
  );
  
  SUPPORTED_LETTERS.forEach(letter => {
    const letterName = letterToComponentName(letter);
    const encodedLetter = getEncodedLetter(letter);
    
    // Base route
    const baseComponentName = `IgraUjemanja${letterName}`;
    const BaseComponent = getComponent(baseComponentName);
    if (BaseComponent) {
      routes.push(
        <Route key={`ujemanja-${letter}`} path={`${config.basePath}/${letter}`} element={<ProtectedRoute><BaseComponent /></ProtectedRoute>} />
      );
      if (encodedLetter) {
        routes.push(
          <Route key={`ujemanja-${letter}-encoded`} path={`${config.basePath}/${encodedLetter}`} element={<ProtectedRoute><BaseComponent /></ProtectedRoute>} />
        );
      }
    }
    
    // Age groups
    const ageGroups: AgeGroup[] = ['56', '78', '910'];
    ageGroups.forEach(ageGroup => {
      const componentName = `IgraUjemanja${letterName}${ageGroup}`;
      const Component = getComponent(componentName);
      if (Component) {
        routes.push(
          <Route key={`ujemanja-${letter}-${ageGroup}`} path={`${config.basePath}/${letter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
        );
        if (encodedLetter) {
          routes.push(
            <Route key={`ujemanja-${letter}-${ageGroup}-encoded`} path={`${config.basePath}/${encodedLetter}${ageGroup}`} element={<ProtectedRoute><Component /></ProtectedRoute>} />
          );
        }
      }
    });
  });
  
  return routes;
}

function generateLabirintRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.labirint;
  
  routes.push(
    <Route key="labirint-main" path={config.basePath} element={<ProtectedRoute><Labirint /></ProtectedRoute>} />
  );
  
  routes.push(
    <Route key="labirint-letter" path={`${config.basePath}/:letter`} element={<ProtectedRoute><LabirintLetter /></ProtectedRoute>} />
  );
  
  return routes;
}

function generateLegacyRedirects(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  
  Object.entries(LEGACY_GAME_ROUTES).forEach(([from, to]) => {
    routes.push(
      <Route key={`redirect-${from}`} path={from} element={<Navigate to={to} replace />} />
    );
  });
  
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route key={`legacy-spomin-${letter}`} path={`/spomin-${letter}`} element={<Navigate to={`/govorne-igre/spomin/spomin-${letter}`} replace />} />
    );
  });
  
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route key={`legacy-sest-${letter}`} path={`/sestavljanke-${letter}`} element={<Navigate to={`/govorne-igre/sestavljanke/${letter}`} replace />} />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-sest-${letter}-${ageGroup}`} path={`/sestavljanke-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/sestavljanke/${letter}${ageGroup}`} replace />} />
      );
    });
  });
  
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route key={`legacy-zap-${letter}`} path={`/zaporedja-${letter}`} element={<Navigate to={`/govorne-igre/zaporedja/${letter}`} replace />} />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-zap-${letter}-${ageGroup}`} path={`/zaporedja-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/zaporedja/${letter}${ageGroup}`} replace />} />
      );
    });
  });
  
  SUPPORTED_LETTERS.forEach(letter => {
    ['34', '56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-drsna-${letter}-${ageGroup}`} path={`/drsna-sestavljanka-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/drsna-sestavljanka/${letter}${ageGroup}`} replace />} />
      );
    });
  });
  
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route key={`legacy-uje-${letter}`} path={`/igra-ujemanja-${letter}`} element={<Navigate to={`/govorne-igre/igra-ujemanja/${letter}`} replace />} />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route key={`legacy-uje-${letter}-${ageGroup}`} path={`/igra-ujemanja-${letter}-${ageGroup}`} element={<Navigate to={`/govorne-igre/igra-ujemanja/${letter}${ageGroup}`} replace />} />
      );
    });
  });
  
  return routes;
}

// ============================================
// GLAVNI EXPORT
// ============================================
export function GameRoutes(): JSX.Element[] {
  return [
    <Route key="govorne-igre" path="/govorne-igre" element={<ProtectedRoute><GovorneIgre /></ProtectedRoute>} />,
    ...generateSpominRoutes(),
    ...generateSestavljankeRoutes(),
    ...generateZaporedjaRoutes(),
    ...generateDrsnaSestavljankaRoutes(),
    ...generateIgraUjemanjaRoutes(),
    ...generateLabirintRoutes(),
    ...generateLegacyRedirects(),
  ];
}
