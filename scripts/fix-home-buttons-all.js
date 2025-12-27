const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../src/pages');

// Get all tsx files in pages directory
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

let fixedCount = 0;
const fixedFiles = [];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Pattern 1: Single-line Button with asChild
  content = content.replace(
    /<Button className="rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white\/50 backdrop-blur-sm" size="icon"><Home className="h-7 w-7 text-white" \/><\/Button>/g,
    '<button className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  // Pattern 2: Button with size="icon" first, className second (fixed position)
  content = content.replace(
    /<Button size="icon" className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white\/50 backdrop-blur-sm">\s*<Home className="h-7 w-7 text-white" \/>\s*<\/Button>/g,
    '<button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  // Pattern 3: Multi-line Button with className first, size second
  content = content.replace(
    /<Button\s+className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white\/50 backdrop-blur-sm"\s+size="icon"\s*>\s*<Home className="h-7 w-7 text-white" \/>\s*<\/Button>/g,
    '<button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    fixedCount++;
    fixedFiles.push(file);
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\n=== Summary ===`);
console.log(`Total files fixed: ${fixedCount}`);
if (fixedFiles.length > 0) {
  console.log('Fixed files:');
  fixedFiles.forEach(f => console.log(`  - ${f}`));
}
