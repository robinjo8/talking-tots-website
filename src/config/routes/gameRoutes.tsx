/**
 * Dinamično generirane game route
 * 
 * Namesto 200+ ročnih Route zapisov, route generiramo dinamično.
 */
import { lazy, ComponentType } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  SUPPORTED_LETTERS, 
  AGE_GROUPS, 
  GAME_CONFIGS, 
  letterToComponentName,
  LEGACY_GAME_ROUTES,
  type SupportedLetter,
  type AgeGroup
} from './routeConfig';

// Cache za lazy komponente - preprečuje večkratno ustvarjanje
const componentCache = new Map<string, ComponentType<any>>();

// Helper za lazy loading komponente
const getLazyComponent = (componentName: string): ComponentType<any> => {
  if (!componentCache.has(componentName)) {
    const LazyComponent = lazy(() => import(`@/pages/${componentName}`));
    componentCache.set(componentName, LazyComponent);
  }
  return componentCache.get(componentName)!;
};

// Generira route za Spomin igre
function generateSpominRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.spomin;
  
  // Glavna stran
  routes.push(
    <Route
      key="spomin-main"
      path={config.basePath}
      element={<ProtectedRoute><SpominGames /></ProtectedRoute>}
    />
  );
  
  // Posamezne črke
  SUPPORTED_LETTERS.forEach(letter => {
    const componentName = `Spomin${letterToComponentName(letter)}`;
    const Component = getLazyComponent(componentName);
    routes.push(
      <Route
        key={`spomin-${letter}`}
        path={`${config.basePath}/spomin-${letter}`}
        element={<ProtectedRoute><Component /></ProtectedRoute>}
      />
    );
  });
  
  return routes;
}

// Generira route za Sestavljanke igre
function generateSestavljankeRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.sestavljanke;
  
  // Glavna stran
  routes.push(
    <Route
      key="sestavljanke-main"
      path={config.basePath}
      element={<ProtectedRoute><SestavljankeGames /></ProtectedRoute>}
    />
  );
  
  // Base letter routes (3-4 leta)
  SUPPORTED_LETTERS.forEach(letter => {
    const componentName = `Sestavljanke${letterToComponentName(letter)}`;
    const Component = getLazyComponent(componentName);
    routes.push(
      <Route
        key={`sestavljanke-${letter}`}
        path={`${config.basePath}/${letter}`}
        element={<ProtectedRoute><Component /></ProtectedRoute>}
      />
    );
  });
  
  // Age group routes
  const ageGroups: AgeGroup[] = ['56', '78', '910'];
  SUPPORTED_LETTERS.forEach(letter => {
    ageGroups.forEach(ageGroup => {
      const componentName = `Sestavljanke${letterToComponentName(letter)}${ageGroup}`;
      const Component = getLazyComponent(componentName);
      routes.push(
        <Route
          key={`sestavljanke-${letter}-${ageGroup}`}
          path={`${config.basePath}/${letter}${ageGroup}`}
          element={<ProtectedRoute><Component /></ProtectedRoute>}
        />
      );
    });
  });
  
  return routes;
}

// Generira route za Zaporedja igre
function generateZaporedjaRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.zaporedja;
  
  // Glavna stran
  routes.push(
    <Route
      key="zaporedja-main"
      path={config.basePath}
      element={<ProtectedRoute><Zaporedja /></ProtectedRoute>}
    />
  );
  
  // Base letter routes
  SUPPORTED_LETTERS.forEach(letter => {
    const componentName = `Zaporedja${letterToComponentName(letter)}`;
    const Component = getLazyComponent(componentName);
    routes.push(
      <Route
        key={`zaporedja-${letter}`}
        path={`${config.basePath}/${letter}`}
        element={<ProtectedRoute><Component /></ProtectedRoute>}
      />
    );
  });
  
  // Age group routes
  const ageGroups: AgeGroup[] = ['56', '78', '910'];
  SUPPORTED_LETTERS.forEach(letter => {
    ageGroups.forEach(ageGroup => {
      const componentName = `Zaporedja${letterToComponentName(letter)}${ageGroup}`;
      const Component = getLazyComponent(componentName);
      routes.push(
        <Route
          key={`zaporedja-${letter}-${ageGroup}`}
          path={`${config.basePath}/${letter}${ageGroup}`}
          element={<ProtectedRoute><Component /></ProtectedRoute>}
        />
      );
    });
  });
  
  return routes;
}

// Generira route za Drsna Sestavljanka igre
function generateDrsnaSestavljankaRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.drsnaSestavljanka;
  
  // Glavna stran
  routes.push(
    <Route
      key="drsna-main"
      path={config.basePath}
      element={<ProtectedRoute><DrsnaSestavljanka /></ProtectedRoute>}
    />
  );
  
  // All age groups including 34
  const ageGroups: AgeGroup[] = ['34', '56', '78', '910'];
  SUPPORTED_LETTERS.forEach(letter => {
    ageGroups.forEach(ageGroup => {
      const componentName = `DrsnaSestavljanka${letterToComponentName(letter)}${ageGroup}`;
      const Component = getLazyComponent(componentName);
      routes.push(
        <Route
          key={`drsna-${letter}-${ageGroup}`}
          path={`${config.basePath}/${letter}${ageGroup}`}
          element={<ProtectedRoute><Component /></ProtectedRoute>}
        />
      );
    });
  });
  
  return routes;
}

// Generira route za Igra Ujemanja
function generateIgraUjemanjaRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.igraUjemanja;
  
  // Glavna stran
  routes.push(
    <Route
      key="ujemanja-main"
      path={config.basePath}
      element={<ProtectedRoute><IgraUjemanja /></ProtectedRoute>}
    />
  );
  
  // Base letter routes
  SUPPORTED_LETTERS.forEach(letter => {
    const componentName = `IgraUjemanja${letterToComponentName(letter)}`;
    const Component = getLazyComponent(componentName);
    routes.push(
      <Route
        key={`ujemanja-${letter}`}
        path={`${config.basePath}/${letter}`}
        element={<ProtectedRoute><Component /></ProtectedRoute>}
      />
    );
  });
  
  // Age group routes
  const ageGroups: AgeGroup[] = ['56', '78', '910'];
  SUPPORTED_LETTERS.forEach(letter => {
    ageGroups.forEach(ageGroup => {
      const componentName = `IgraUjemanja${letterToComponentName(letter)}${ageGroup}`;
      const Component = getLazyComponent(componentName);
      routes.push(
        <Route
          key={`ujemanja-${letter}-${ageGroup}`}
          path={`${config.basePath}/${letter}${ageGroup}`}
          element={<ProtectedRoute><Component /></ProtectedRoute>}
        />
      );
    });
  });
  
  return routes;
}

// Generira route za Labirint
function generateLabirintRoutes(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  const config = GAME_CONFIGS.labirint;
  
  // Glavna stran
  routes.push(
    <Route
      key="labirint-main"
      path={config.basePath}
      element={<ProtectedRoute><Labirint /></ProtectedRoute>}
    />
  );
  
  // Dynamic letter route
  routes.push(
    <Route
      key="labirint-letter"
      path={`${config.basePath}/:letter`}
      element={<ProtectedRoute><LabirintLetter /></ProtectedRoute>}
    />
  );
  
  return routes;
}

// Legacy redirecti
function generateLegacyRedirects(): JSX.Element[] {
  const routes: JSX.Element[] = [];
  
  // Glavni redirecti
  Object.entries(LEGACY_GAME_ROUTES).forEach(([from, to]) => {
    routes.push(
      <Route key={`redirect-${from}`} path={from} element={<Navigate to={to} replace />} />
    );
  });
  
  // Spomin legacy routes
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route
        key={`legacy-spomin-${letter}`}
        path={`/spomin-${letter}`}
        element={<Navigate to={`/govorne-igre/spomin/spomin-${letter}`} replace />}
      />
    );
  });
  
  // Sestavljanke legacy routes
  SUPPORTED_LETTERS.forEach(letter => {
    // Base
    routes.push(
      <Route
        key={`legacy-sest-${letter}`}
        path={`/sestavljanke-${letter}`}
        element={<Navigate to={`/govorne-igre/sestavljanke/${letter}`} replace />}
      />
    );
    // Age groups
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route
          key={`legacy-sest-${letter}-${ageGroup}`}
          path={`/sestavljanke-${letter}-${ageGroup}`}
          element={<Navigate to={`/govorne-igre/sestavljanke/${letter}${ageGroup}`} replace />}
        />
      );
    });
  });
  
  // Zaporedja legacy routes
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route
        key={`legacy-zap-${letter}`}
        path={`/zaporedja-${letter}`}
        element={<Navigate to={`/govorne-igre/zaporedja/${letter}`} replace />}
      />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route
          key={`legacy-zap-${letter}-${ageGroup}`}
          path={`/zaporedja-${letter}-${ageGroup}`}
          element={<Navigate to={`/govorne-igre/zaporedja/${letter}${ageGroup}`} replace />}
        />
      );
    });
  });
  
  // Drsna sestavljanka legacy routes
  SUPPORTED_LETTERS.forEach(letter => {
    ['34', '56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route
          key={`legacy-drsna-${letter}-${ageGroup}`}
          path={`/drsna-sestavljanka-${letter}-${ageGroup}`}
          element={<Navigate to={`/govorne-igre/drsna-sestavljanka/${letter}${ageGroup}`} replace />}
        />
      );
    });
  });
  
  // Igra ujemanja legacy routes
  SUPPORTED_LETTERS.forEach(letter => {
    routes.push(
      <Route
        key={`legacy-uje-${letter}`}
        path={`/igra-ujemanja-${letter}`}
        element={<Navigate to={`/govorne-igre/igra-ujemanja/${letter}`} replace />}
      />
    );
    ['56', '78', '910'].forEach(ageGroup => {
      routes.push(
        <Route
          key={`legacy-uje-${letter}-${ageGroup}`}
          path={`/igra-ujemanja-${letter}-${ageGroup}`}
          element={<Navigate to={`/govorne-igre/igra-ujemanja/${letter}${ageGroup}`} replace />}
        />
      );
    });
  });
  
  return routes;
}

// Lazy loaded game main pages
const SpominGames = lazy(() => import('@/pages/SpominGames'));
const SestavljankeGames = lazy(() => import('@/pages/SestavljankeGames'));
const Zaporedja = lazy(() => import('@/pages/Zaporedja'));
const DrsnaSestavljanka = lazy(() => import('@/pages/DrsnaSestavljanka'));
const IgraUjemanja = lazy(() => import('@/pages/IgraUjemanja'));
const Labirint = lazy(() => import('@/pages/Labirint'));
const LabirintLetter = lazy(() => import('@/pages/LabirintLetter'));
const GovorneIgre = lazy(() => import('@/pages/GovorneIgre'));

// Glavni export - vse game route
export function GameRoutes(): JSX.Element[] {
  return [
    // Govorne igre main page
    <Route
      key="govorne-igre"
      path="/govorne-igre"
      element={<ProtectedRoute><GovorneIgre /></ProtectedRoute>}
    />,
    ...generateSpominRoutes(),
    ...generateSestavljankeRoutes(),
    ...generateZaporedjaRoutes(),
    ...generateDrsnaSestavljankaRoutes(),
    ...generateIgraUjemanjaRoutes(),
    ...generateLabirintRoutes(),
    ...generateLegacyRedirects(),
  ];
}
