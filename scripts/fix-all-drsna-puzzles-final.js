// Batch update all DrsnaSestavljanka files to match Sestavljanke style
// Run: node scripts/fix-all-drsna-puzzles-final.js

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
  'DrsnaSestavljankaŽ56.tsx',
  'DrsnaSestavljankaC34.tsx',
  'DrsnaSestavljankaR34.tsx',
  'DrsnaSestavljankaR56.tsx',
  'DrsnaSestavljankaL34.tsx',
  'DrsnaSestavljankaL56.tsx',
  'DrsnaSestavljankaK34.tsx',
  'DrsnaSestavljankaK56.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../src/pages', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - file doesn't exist`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Replace import
  content = content.replace(
    'import { PuzzleSuccessDialog } from "@/components/puzzle/PuzzleSuccessDialog";',
    'import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";'
  );
  
  // 2. Fix mobile buttons - add variant="outline" back and change justify-center to justify-between
  content = content.replace(
    /className="flex justify-center gap-3">\s*<Button onClick={handleBack} size="sm" className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    'className="flex justify-between gap-3">\n              <Button variant="outline" onClick={handleBack} size="sm" className="gap-2">'
  );
  
  content = content.replace(
    /<Button onClick={\(\) => setShowInstructions\(true\)} size="sm" className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    '<Button variant="outline" onClick={() => setShowInstructions(true)} size="sm" className="gap-2">'
  );
  
  // 3. Fix desktop buttons - add variant="outline" back
  content = content.replace(
    /<Button onClick={handleBack} className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    '<Button variant="outline" onClick={handleBack} className="gap-2">'
  );
  
  content = content.replace(
    /<Button onClick={\(\) => setShowInstructions\(true\)} className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    '<Button variant="outline" onClick={() => setShowInstructions(true)} className="gap-2">'
  );
  
  // 4. Replace PuzzleSuccessDialog with MatchingCompletionDialog
  content = content.replace(
    /<PuzzleSuccessDialog\s*isOpen={showCompletion}\s*onOpenChange={setShowCompletion}\s*completedImage={currentImage}\s*onStarClaimed={handleStarClaimed}\s*\/>/g,
    `<MatchingCompletionDialog 
          isOpen={showCompletion} 
          onClose={() => setShowCompletion(false)}
          images={[{ word: currentImage.word, url: imageUrl, filename: currentImage.filename }]}
          onStarClaimed={handleStarClaimed}
          instructionText="KLIKNI NA SPODNJO SLIČICO IN PONOVI BESEDO. ZA IZGOVORJAVO IMAŠ NA VOLJO 3 SEKUNDE ČASA. V KOLIKOR TI NE USPE, LAHKO PONOVIŠ Z GUMBOM 'PONOVI'."
        />`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed ${file}`);
});

console.log('\n✅ All files updated!');
