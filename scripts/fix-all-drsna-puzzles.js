// This is a temporary utility script to batch update all DrsnaSestavljanka files
// Run: node scripts/fix-all-drsna-puzzles.js

const fs = require('fs');
const path = require('path');

const files = [
  'DrsnaSestavljankaS34.tsx',
  'DrsnaSestavljankaS56.tsx',
  'DrsnaSestavljankaZ34.tsx',
  'DrsnaSestavljankaZ56.tsx',
  'DrsnaSestavljankaČ34.tsx',
  'DrsnaSestavljankaČ56.tsx',
  'DrsnaSestavljankaŠ34.tsx',
  'DrsnaSestavljankaŠ56.tsx',
  'DrsnaSestavljankaŽ34.tsx',
  'DrsnaSestavljankaŽ56.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../src/pages', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace import
  content = content.replace(
    "import { MatchingCompletionDialog } from \"@/components/matching/MatchingCompletionDialog\";",
    "import { PuzzleSuccessDialog } from \"@/components/puzzle/PuzzleSuccessDialog\";"
  );
  
  // Replace all MatchingCompletionDialog instances with PuzzleSuccessDialog
  content = content.replace(
    /<MatchingCompletionDialog[\s\S]*?\/>/g,
    (match) => {
      return `<PuzzleSuccessDialog
          isOpen={showCompletion}
          onOpenChange={setShowCompletion}
          completedImage={currentImage}
          onStarClaimed={handleStarClaimed}
        />`;
    }
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${file}`);
});

console.log('All files fixed!');
