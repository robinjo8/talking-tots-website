// Script to wrap "Nazaj" buttons with MemoryExitConfirmationDialog
import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Get all game files that need updating
const allGameFiles = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx'))
  .filter(f => 
    (f.startsWith('DrsnaSestavljanka') && !f.includes('Router')) ||
    (f.startsWith('Sestavljanke') && !f.includes('Games')) ||
    f.startsWith('IgraUjemanja')
  );

// Exclude files already updated
const updatedFiles = [
  'DrsnaSestavljankaR56.tsx',
  'SestavljankeR.tsx',
  'IgraUjemanjaR.tsx',
  'DrsnaSestavljankaC78.tsx',
  'DrsnaSestavljankaK34.tsx',
  'DrsnaSestavljankaK56.tsx'
];

const filesToUpdate = allGameFiles.filter(f => !updatedFiles.includes(f));

console.log(`\nProcessing ${filesToUpdate.length} files...\n`);

let successCount = 0;
let skipCount = 0;

filesToUpdate.forEach((file) => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already has MemoryExitConfirmationDialog
  if (content.includes('MemoryExitConfirmationDialog')) {
    console.log(`⏭️  Skipping ${file} - already has dialog`);
    skipCount++;
    return;
  }
  
  let modified = false;
  
  // Add import if not present
  if (!content.includes('MemoryExitConfirmationDialog')) {
    // Find last import line
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
  }
  
  // Pattern 1: Mobile view - multi-line Button with onClick={handleBack}
  const mobilePattern1 = /(<Button\s+onClick={handleBack}\s+size="sm"\s+variant="outline"\s+className="gap-2"\s*>\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>)/g;
  if (mobilePattern1.test(content)) {
    content = content.replace(mobilePattern1, (match) => {
      const indent = match.match(/^(\s*)/)?.[1] || '';
      return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
             `${indent}  <Button\n` +
             `${indent}    size="sm"\n` +
             `${indent}    variant="outline"\n` +
             `${indent}    className="gap-2"\n` +
             `${indent}  >\n` +
             `${indent}    <ArrowLeft className="h-4 w-4" />\n` +
             `${indent}    Nazaj\n` +
             `${indent}  </Button>\n` +
             `${indent}</MemoryExitConfirmationDialog>`;
    });
    modified = true;
  }
  
  // Pattern 2: Mobile view - multi-line with different formatting
  const mobilePattern2 = /(\s+)<Button\s+onClick={handleBack}\s+size="sm"\s+variant="outline"\s+className="gap-2">/g;
  if (mobilePattern2.test(content)) {
    content = content.replace(
      /(\s+)<Button\s+onClick={handleBack}\s+size="sm"\s+variant="outline"\s+className="gap-2">\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
      (match, indent) => {
        return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
               `${indent}  <Button\n` +
               `${indent}    size="sm"\n` +
               `${indent}    variant="outline"\n` +
               `${indent}    className="gap-2"\n` +
               `${indent}  >\n` +
               `${indent}    <ArrowLeft className="h-4 w-4" />\n` +
               `${indent}    Nazaj\n` +
               `${indent}  </Button>\n` +
               `${indent}</MemoryExitConfirmationDialog>`;
      }
    );
    modified = true;
  }
  
  // Pattern 3: Desktop view - inline Button variant="outline" onClick={handleBack}
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
  
  // Pattern 4: Desktop view - Button onClick={handleBack} variant="outline"
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
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${file}`);
    successCount++;
  } else {
    console.log(`⚠️  No changes needed for ${file}`);
  }
});

console.log(`\n✨ Done! Updated ${successCount} files, skipped ${skipCount} files.\n`);
