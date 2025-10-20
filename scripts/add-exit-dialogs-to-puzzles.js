// Script to add exit confirmation dialogs to all puzzle games
import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Files that still need updating
const filesToUpdate = [
  'SestavljankeL910.tsx',
  'SestavljankeR56.tsx', 'SestavljankeR78.tsx', 'SestavljankeR910.tsx',
  'SestavljankeS.tsx', 'SestavljankeS56.tsx', 'SestavljankeS78.tsx', 'SestavljankeS910.tsx',
  'SestavljankeZ.tsx', 'SestavljankeZ56.tsx', 'SestavljankeZ78.tsx', 'SestavljankeZ910.tsx',
  'SestavljankeČ.tsx', 'SestavljankeČ56.tsx', 'SestavljankeČ78.tsx', 'SestavljankeČ910.tsx',
  'SestavljankeŠ.tsx', 'SestavljankeŠ56.tsx', 'SestavljankeŠ78.tsx', 'SestavljankeŠ910.tsx',
  'SestavljankeŽ.tsx', 'SestavljankeŽ56.tsx', 'SestavljankeŽ78.tsx', 'SestavljankeŽ910.tsx',
  'SestavljankeX.tsx'
];

console.log(`\nProcessing ${filesToUpdate.length} files...\n`);

let successCount = 0;

filesToUpdate.forEach((file) => {
  const filePath = path.join(pagesDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${file} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already has MemoryExitConfirmationDialog
  if (content.includes('MemoryExitConfirmationDialog')) {
    console.log(`⏭️  Skipping ${file} - already has dialog`);
    return;
  }
  
  let modified = false;
  
  // Add import if not present
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, 'import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";');
    content = lines.join('\n');
    modified = true;
  }
  
  // Pattern 1: Mobile view - multi-line Button with onClick={handleBack} size="sm"
  content = content.replace(
    /(\s+)<Button\s+onClick={handleBack}\s+size="sm"\s+variant="outline"\s+className="gap-2">\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
    (match, indent) => {
      return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
             `${indent}  <Button size="sm" variant="outline" className="gap-2">\n` +
             `${indent}    <ArrowLeft className="h-4 w-4" />\n` +
             `${indent}    Nazaj\n` +
             `${indent}  </Button>\n` +
             `${indent}</MemoryExitConfirmationDialog>`;
    }
  );
  
  // Pattern 2: Desktop view - Button variant="outline" onClick={handleBack}
  content = content.replace(
    /(\s+)<Button\s+variant="outline"\s+onClick={handleBack}\s+className="gap-2">\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
    (match, indent) => {
      return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
             `${indent}  <Button variant="outline" className="gap-2">\n` +
             `${indent}    <ArrowLeft className="h-4 w-4" />\n` +
             `${indent}    Nazaj\n` +
             `${indent}  </Button>\n` +
             `${indent}</MemoryExitConfirmationDialog>`;
    }
  );
  
  // Pattern 3: Desktop view - Button onClick={handleBack} variant="outline"
  content = content.replace(
    /(\s+)<Button\s+onClick={handleBack}\s+variant="outline"\s+className="gap-2">\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
    (match, indent) => {
      return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
             `${indent}  <Button variant="outline" className="gap-2">\n` +
             `${indent}    <ArrowLeft className="h-4 w-4" />\n` +
             `${indent}    Nazaj\n` +
             `${indent}  </Button>\n` +
             `${indent}</MemoryExitConfirmationDialog>`;
    }
  );
  
  // Pattern 4: Mobile multiline with different structure
  content = content.replace(
    /(<Button[\s\n]+onClick={handleBack}[\s\n]+size="sm"[\s\n]+variant="outline"[\s\n]+className="gap-2"[\s\n]*>[\s\n]*<ArrowLeft className="h-4 h-4" \/>[\s\n]*Nazaj[\s\n]*<\/Button>)/g,
    (match) => {
      const indent = match.match(/^(\s*)/)?.[1] || '';
      return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
             `${indent}  <Button size="sm" variant="outline" className="gap-2">\n` +
             `${indent}    <ArrowLeft className="h-4 w-4" />\n` +
             `${indent}    Nazaj\n` +
             `${indent}  </Button>\n` +
             `${indent}</MemoryExitConfirmationDialog>`;
    }
  );
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${file}`);
    successCount++;
  } else {
    console.log(`⚠️  No pattern match for ${file}`);
  }
});

console.log(`\n✨ Done! Updated ${successCount} files.\n`);
