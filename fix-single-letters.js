#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common single-letter variable mappings
const variableMappings = {
  'a': 'item',
  'b': 'secondItem', 
  'c': 'company',
  'd': 'data',
  'e': 'element',
  'f': 'file',
  'g': 'group',
  'h': 'header',
  'i': 'item',
  'j': 'job',
  'k': 'key',
  'l': 'lead',
  'm': 'member',
  'n': 'name',
  'o': 'option',
  'p': 'person',
  'q': 'query',
  'r': 'result',
  's': 'stage',
  't': 'type',
  'u': 'user',
  'v': 'value',
  'w': 'word',
  'x': 'xItem',
  'y': 'yItem',
  'z': 'zItem'
};

function getAllTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function fixSingleLetterVariables(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Pattern to match single letter variables in arrow functions
  const patterns = [
    // .find(x => ...)
    /(\.\w+\(\s*)([a-z])\s*=>/g,
    // .map(x => ...)  
    /(\.\w+\(\s*)([a-z])\s*=>/g,
    // .filter(x => ...)
    /(\.\w+\(\s*)([a-z])\s*=>/g,
    // .reduce((acc, x) => ...)
    /(\.\w+\(\s*\([^,]+,\s*)([a-z])\s*\)\s*=>/g,
    // Array methods with single letter
    /(\w+\.\w+\(\s*)([a-z])\s*=>/g
  ];
  
  // More specific patterns for common cases
  const specificReplacements = [
    // .split(' ').map(n => n[0])
    { pattern: /\.split\([^)]+\)\.map\(\s*n\s*=>/g, replacement: '.split($1).map(namePart =>' },
    // .find(l => l.id === 
    { pattern: /\.find\(\s*l\s*=>\s*l\./g, replacement: '.find(lead => lead.' },
    // .find(c => c.id ===
    { pattern: /\.find\(\s*c\s*=>\s*c\./g, replacement: '.find(company => company.' },
    // .find(j => j.id ===
    { pattern: /\.find\(\s*j\s*=>\s*j\./g, replacement: '.find(job => job.' },
    // .find(u => u.id ===
    { pattern: /\.find\(\s*u\s*=>\s*u\./g, replacement: '.find(user => user.' },
    // .find(m => m.id ===
    { pattern: /\.find\(\s*m\s*=>\s*m\./g, replacement: '.find(member => member.' },
    // .find(s => s.key ===
    { pattern: /\.find\(\s*s\s*=>\s*s\./g, replacement: '.find(stage => stage.' },
    // .find(t => t.value ===
    { pattern: /\.find\(\s*t\s*=>\s*t\./g, replacement: '.find(type => type.' },
    // .find(r => r.id ===
    { pattern: /\.find\(\s*r\s*=>\s*r\./g, replacement: '.find(role => role.' },
    // .find(p => p.company_id ===
    { pattern: /\.find\(\s*p\s*=>\s*p\./g, replacement: '.find(person => person.' },
    // .find(a => a.type ===
    { pattern: /\.find\(\s*a\s*=>\s*a\./g, replacement: '.find(activity => activity.' },
    // .find(i => i.interaction_type ===
    { pattern: /\.find\(\s*i\s*=>\s*i\./g, replacement: '.find(interaction => interaction.' },
    // .find(h => h.name ===
    { pattern: /\.find\(\s*h\s*=>\s*h\./g, replacement: '.find(header => header.' },
    
    // Filter patterns
    { pattern: /\.filter\(\s*l\s*=>\s*l\./g, replacement: '.filter(lead => lead.' },
    { pattern: /\.filter\(\s*c\s*=>\s*c\./g, replacement: '.filter(company => company.' },
    { pattern: /\.filter\(\s*j\s*=>\s*j\./g, replacement: '.filter(job => job.' },
    { pattern: /\.filter\(\s*u\s*=>\s*u\./g, replacement: '.filter(user => user.' },
    { pattern: /\.filter\(\s*m\s*=>\s*m\./g, replacement: '.filter(member => member.' },
    { pattern: /\.filter\(\s*p\s*=>\s*p\./g, replacement: '.filter(person => person.' },
    { pattern: /\.filter\(\s*a\s*=>\s*a\./g, replacement: '.filter(activity => activity.' },
    { pattern: /\.filter\(\s*i\s*=>\s*i\./g, replacement: '.filter(interaction => interaction.' },
    
    // Map patterns
    { pattern: /\.map\(\s*l\s*=>\s*l\./g, replacement: '.map(lead => lead.' },
    { pattern: /\.map\(\s*c\s*=>\s*c\./g, replacement: '.map(company => company.' },
    { pattern: /\.map\(\s*j\s*=>\s*j\./g, replacement: '.map(job => job.' },
    { pattern: /\.map\(\s*u\s*=>\s*u\./g, replacement: '.map(user => user.' },
    { pattern: /\.map\(\s*m\s*=>\s*m\./g, replacement: '.map(member => member.' },
    { pattern: /\.map\(\s*p\s*=>\s*p\./g, replacement: '.map(person => person.' },
    { pattern: /\.map\(\s*n\s*=>\s*n\[/g, replacement: '.map(namePart => namePart[' },
    
    // Reduce patterns  
    { pattern: /\.reduce\(\([^,]+,\s*m\)\s*=>\s*[^+]*\+\s*m\./g, replacement: (match) => match.replace(/\bm\b/g, 'metric') },
  ];
  
  for (const replacement of specificReplacements) {
    const newContent = content.replace(replacement.pattern, replacement.replacement);
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
  
  return changed;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = getAllTsxFiles(srcDir);

console.log(`Found ${files.length} TypeScript files to process...`);

let totalFixed = 0;
for (const file of files) {
  if (fixSingleLetterVariables(file)) {
    totalFixed++;
  }
}

console.log(`\nFixed ${totalFixed} files with single-letter variable issues.`);
