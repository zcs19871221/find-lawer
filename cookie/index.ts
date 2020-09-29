import path from 'path';
import { readFileSync } from 'better-fs';
const get = () => {
  return readFileSync(path.join(process.cwd(), '.cookie'), 'utf-8')
    .replace(/^Cookie: /, '')
    .trim()
    .replace(/\\n$/, '');
};

export { get };
