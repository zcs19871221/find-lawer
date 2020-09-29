import path from 'path';
import { writeFileSync, readFileSync, isExistSync } from 'better-fs';

interface Case {
  time: string;
  number: string;
  name: string;
  type: string;
  detailLink: string;
}
interface FinedLawCompany {
  [id: string]: {
    name: string;
    url: string;
    cases: Case[];
  };
}
const locate = path.join(process.cwd(), './case.json');
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
export { write, Case };
