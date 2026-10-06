import fs from 'fs';
import path from 'path';

const KNOWLEDGE_DIR = './knowledge';

export function loadKnowledge(type = 'copywriting') {
  const file = path.join(KNOWLEDGE_DIR, `${type}.txt`);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8');
}

export function getAllKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return {};
  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.txt'));
  const knowledge = {};
  files.forEach(f => {
    const key = f.replace('.txt', '');
    knowledge[key] = fs.readFileSync(path.join(KNOWLEDGE_DIR, f), 'utf8');
  });
  return knowledge;
}