/**
 * Script to fix labirint games for all letters
 * 
 * This script performs the following changes:
 * 1. Updates routes.tsx to use a single dynamic route `:letter` instead of individual routes
 * 2. Updates LabirintLetter.tsx to properly decode URL-encoded characters
 * 
 * Run with: node scripts/fix-labirint-all-letters.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing labirint games for all letters...\n');

// Fix routes.tsx
const routesPath = path.join(__dirname, '..', 'src', 'config', 'routes.tsx');
let routesContent = fs.readFileSync(routesPath, 'utf8');

// Replace all individual letter routes with single dynamic route
const oldRoutes = `      <Route 
        path="/govorne-igre/labirint/c" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/č" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/k" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/l" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/r" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/s" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/š" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/z" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/ž" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />`;

const newRoute = `      <Route 
        path="/govorne-igre/labirint/:letter" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
          </ProtectedRoute>
        }
      />`;

if (routesContent.includes(oldRoutes)) {
  routesContent = routesContent.replace(oldRoutes, newRoute);
  fs.writeFileSync(routesPath, routesContent, 'utf8');
  console.log('✅ routes.tsx: Replaced individual letter routes with dynamic :letter route');
} else if (routesContent.includes('/govorne-igre/labirint/:letter')) {
  console.log('✅ routes.tsx: Dynamic route already exists');
} else {
  console.log('⚠️ routes.tsx: Could not find routes to replace - manual check needed');
}

// Fix LabirintLetter.tsx
const labirintPath = path.join(__dirname, '..', 'src', 'pages', 'LabirintLetter.tsx');
let labirintContent = fs.readFileSync(labirintPath, 'utf8');

const oldParams = `const LabirintLetter = () => {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();`;

const newParams = `const LabirintLetter = () => {
  const { letter: rawLetter } = useParams<{ letter: string }>();
  // Decode URL-encoded letters (e.g., %C4%8D → č)
  const letter = rawLetter ? decodeURIComponent(rawLetter) : undefined;
  const navigate = useNavigate();`;

if (labirintContent.includes(oldParams)) {
  labirintContent = labirintContent.replace(oldParams, newParams);
  fs.writeFileSync(labirintPath, labirintContent, 'utf8');
  console.log('✅ LabirintLetter.tsx: Added URL decoding for letter parameter');
} else if (labirintContent.includes('decodeURIComponent(rawLetter)')) {
  console.log('✅ LabirintLetter.tsx: URL decoding already exists');
} else {
  console.log('⚠️ LabirintLetter.tsx: Could not find code to replace - manual check needed');
}

console.log('\n🎉 Done! Labirint games should now work for all letters (C, Č, K, L, R, S, Š, Z, Ž)');
console.log('\nTo apply changes:');
console.log('  git add .');
console.log('  git commit -m "Fix maze game for all letters with proper URL decoding"');
console.log('  git push');
