// Script to add autoPlayAudio={true} to all sliding puzzle completion dialogs
import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';
const files = fs.readdirSync(pagesDir).filter(file => 
  file.startsWith('DrsnaSestavljanka') && 
  file.endsWith('.tsx') &&
  !file.includes('34Router')
);

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace MatchingCompletionDialog without autoPlayAudio
  const oldPattern = /(\s+onStarClaimed=\{handleStarClaimed\})\s*\/>/g;
  const newPattern = '$1\n          autoPlayAudio={true}\n        />';
  
  if (content.includes('onStarClaimed={handleStarClaimed}') && !content.includes('autoPlayAudio={true}')) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});