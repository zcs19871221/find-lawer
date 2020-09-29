import path from 'path';
import { writeFileSync, readFileSync, isExistSync } from 'better-fs';

interface Case {
  time: string;
  number: string;
  name: string;
  detailLink: string;
  lawer: string;
}
interface FindedInfo {
  name: string;
  url: string;
  cases: Case[];
  lawers?: any;
}

interface FinedLawCompany {
  [id: string]: FindedInfo;
}
const locate = path.join(process.cwd(), './detail.json');
function read(): FinedLawCompany {
  try {
    if (isExistSync(locate)) {
      return JSON.parse(readFileSync(locate, 'utf-8'));
    }
    return {};
  } catch (e) {
    return {};
  }
}

function write(lawInfo: FinedLawCompany) {
  const existInfo = read();
  writeFileSync(locate, JSON.stringify({ ...existInfo, ...lawInfo }, null, 2));
}
function writeSorted(lawInfo: any) {
  writeFileSync(
    path.join(process.cwd(), 'sorted.json'),
    JSON.stringify(lawInfo, null, 2),
  );
}
export { write, Case, read, FinedLawCompany, writeSorted };
