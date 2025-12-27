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
  
  // Pattern 1: Single-line Button with size="icon" after className
  content = content.replace(
    /<Button className="([^"]*?)rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white\/50 backdrop-blur-sm" size="icon">\s*<Home className="h-7 w-7 text-white" \/>\s*<\/Button>/g,
    '<button className="$1w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  // Pattern 2: Multi-line Button with size="icon" after className
  content = content.replace(
    /<Button\s*\n?\s*className="([^"]*?)rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white\/50 backdrop-blur-sm"\s*\n?\s*size="icon"\s*\n?\s*>\s*\n?\s*<Home className="h-7 w-7 text-white" \/>\s*\n?\s*<\/Button>/g,
    '<button className="$1w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  // Pattern 3: Button with size="icon" first, then className (fixed position)
  content = content.replace(
    /<Button size="icon" className="([^"]*?)rounded-full w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg border-2 border-white\/50 backdrop-blur-sm">\s*<Home className="h-7 w-7 text-white" \/>\s*<\/Button>/g,
    '<button className="$1w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  // Pattern 4: button with bg-gradient-to-br (already button but wrong gradient)
  content = content.replace(
    /<button className="([^"]*?)bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600([^"]*?)">\s*<Home className="w-11 h-11"([^/]*?)\/>\s*<\/button>/g,
    '<button className="$1bg-gradient-to-r from-amber-400 to-orange-500 $2 hover:scale-105 transition-transform"><Home className="w-8 h-8 text-white" /></button>'
  );
  
  // Pattern 5: Any remaining bg-gradient-to-br with Home h-7 w-7
  content = content.replace(
    /bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600/g,
    'bg-gradient-to-r from-amber-400 to-orange-500'
  );
  
  // Pattern 6: Change h-7 w-7 to w-8 h-8 for Home icons in home buttons
  content = content.replace(
    /<Home className="h-7 w-7 text-white" \/>/g,
    '<Home className="w-8 h-8 text-white" />'
  );
  
  // Pattern 7: Add hover:scale-105 transition-transform if missing
  content = content.replace(
    /rounded-full bg-gradient-to-r from-amber-400 to-orange-500([^"]*?)shadow-lg border-2 border-white\/50 backdrop-blur-sm"/g,
    (match) => {
      if (!match.includes('hover:scale-105')) {
        return match.replace('backdrop-blur-sm"', 'backdrop-blur-sm hover:scale-105 transition-transform"');
      }
      return match;
    }
  );
  
  // Pattern 8: Replace <Button with <button where appropriate
  content = content.replace(
    /<Button\s+size="icon"\s+className="([^"]*?)w-16 h-16([^"]*?)bg-gradient-to-r from-amber-400 to-orange-500([^"]*?)">\s*<Home/g,
    '<button className="$1w-16 h-16$2bg-gradient-to-r from-amber-400 to-orange-500$3 flex items-center justify-center hover:scale-105 transition-transform"><Home'
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
