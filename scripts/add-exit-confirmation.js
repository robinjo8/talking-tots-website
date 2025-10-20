// Script to add MemoryExitConfirmationDialog to all game pages
import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';

// Files to update
const gameFiles = [
  // Drsna sestavljanka
  ...fs.readdirSync(pagesDir).filter(f => f.startsWith('DrsnaSestavljanka') && f.endsWith('.tsx') && !f.includes('Router') && !f.includes('R56')),
  // Sestavljanke  
  ...fs.readdirSync(pagesDir).filter(f => f.startsWith('Sestavljanke') && f.endsWith('.tsx') && f !== 'SestavljankeR.tsx' && f !== 'SestavljankeGames.tsx'),
  // Igra ujemanja
  ...fs.readdirSync(pagesDir).filter(f => f.startsWith('IgraUjemanja') && f.endsWith('.tsx') && f !== 'IgraUjemanjaR.tsx')
];

console.log(`Processing ${gameFiles.length} files...`);

gameFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already has MemoryExitConfirmationDialog
  if (content.includes('MemoryExitConfirmationDialog')) {
    console.log(`Skipping ${file} - already has MemoryExitConfirmationDialog`);
    return;
  }
  
  // Add import
  const importLine = 'import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";';
  
  // Find the last import line
  const lines = content.split('\n');
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, importLine);
    content = lines.join('\n');
  }
  
  // Pattern 1: Button with onClick={handleBack} and size="sm" (mobile)
  content = content.replace(
    /<Button\s+onClick={handleBack}\s+size="sm"\s+variant="outline"\s+className="gap-2"\s*>\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
    `<MemoryExitConfirmationDialog onConfirm={handleBack}>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Nazaj
                </Button>
              </MemoryExitConfirmationDialog>`
  );
  
  // Pattern 2: Button with onClick={handleBack} variant="outline" (desktop simple)
  content = content.replace(
    /<Button\s+variant="outline"\s+onClick={handleBack}\s+className="gap-2"\s*>\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
    `<MemoryExitConfirmationDialog onConfirm={handleBack}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
          </MemoryExitConfirmationDialog>`
  );
  
  // Pattern 3: Button onClick={handleBack} variant="outline" (reverse order)
  content = content.replace(
    /<Button\s+onClick={handleBack}\s+variant="outline"\s+className="gap-2"\s*>\s*<ArrowLeft className="h-4 h-4" \/>\s*Nazaj\s*<\/Button>/g,
    `<MemoryExitConfirmationDialog onConfirm={handleBack}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
        </MemoryExitConfirmationDialog>`
  );
  
  // Pattern 4: Multi-line Button with onClick on separate line
  content = content.replace(
    /(<Button[\s\S]*?)onClick={handleBack}([\s\S]*?<ArrowLeft className="h-4 h-4" \/>[\s\S]*?Nazaj[\s\S]*?<\/Button>)/g,
    (match, before, after) => {
      // Extract indentation
      const lines = match.split('\n');
      const indent = lines[0].match(/^(\s*)/)[1];
      
      return `${indent}<MemoryExitConfirmationDialog onConfirm={handleBack}>\n` +
             `${indent}  <Button${before.replace('<Button', '')}${after.replace('onClick={handleBack}', '').trim()}\n` +
             `${indent}</MemoryExitConfirmationDialog>`;
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated ${file}`);
});

console.log('Done!');
