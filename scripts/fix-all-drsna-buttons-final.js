// Final fix for all DrsnaSestavljanka buttons to match reference image
// Buttons: Nazaj (outline), Nova igra (green), Navodila (outline)
// Run: node scripts/fix-all-drsna-buttons-final.js

const fs = require('fs');
const path = require('path');

const files = [
  'DrsnaSestavljankaC34.tsx',
  'DrsnaSestavljankaC56.tsx',
  'DrsnaSestavljankaC78.tsx',
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
  'DrsnaSestavljankaK34.tsx',
  'DrsnaSestavljankaK56.tsx',
  'DrsnaSestavljankaL34.tsx',
  'DrsnaSestavljankaL56.tsx',
  'DrsnaSestavljankaR34.tsx',
  'DrsnaSestavljankaR56.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../src/pages', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${file} - doesn't exist`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix mobile buttons - replace bg-black with variant="outline" and change justify-center to justify-between
  content = content.replace(
    /className="flex justify-center gap-3">\s*<Button onClick={handleBack} size="sm" className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    'className="flex justify-between gap-3">\n              <Button variant="outline" onClick={handleBack} size="sm" className="gap-2">'
  );
  
  content = content.replace(
    /<Button onClick={\(\) => setShowInstructions\(true\)} size="sm" className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    '<Button variant="outline" onClick={() => setShowInstructions(true)} size="sm" className="gap-2">'
  );
  
  // Fix desktop buttons - replace bg-black with variant="outline"
  content = content.replace(
    /<Button onClick={handleBack} className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    '<Button variant="outline" onClick={handleBack} className="gap-2">'
  );
  
  content = content.replace(
    /<Button onClick={\(\) => setShowInstructions\(true\)} className="bg-black hover:bg-black\/90 text-white gap-2">/g,
    '<Button variant="outline" onClick={() => setShowInstructions(true)} className="gap-2">'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
});

console.log('\n🎉 All DrsnaSestavljanka files updated!');
