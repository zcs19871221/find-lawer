import path from 'path';
import { writeFileSync, readFileSync, isExistSync } from 'better-fs';

export interface LawCompanyInfo {
  [id: string]: string;
}

const locate = path.join(process.cwd(), './company.json');
export function read(): LawCompanyInfo {
  try {
    if (isExistSync(locate)) {
      return JSON.parse(readFileSync(locate, 'utf-8'));
    }
    return {};
  } catch (e) {
    return {};
  }
}

export function write(lawInfo: LawCompanyInfo) {
  const existInfo = read();
  writeFileSync(locate, JSON.stringify({ ...existInfo, ...lawInfo }, null, 2));
}
