import path from 'path';
import { writeFileSync } from 'fs';
import { read, Case } from '../collect-companys-detail';

const filter = async () => {
  const detail = Object.values(read());
  const cases: Case[] = [];
  detail.forEach(d => {
    cases.push(...d.cases.filter(ee => ee.isSpecail === true));
  });
  cases.sort((a, b) => {
    return Number(b.time) - Number(a.time);
  });
  writeFileSync(
    path.join(process.cwd(), 'speical.json'),
    JSON.stringify(cases, null, 2),
  );
};
filter();
