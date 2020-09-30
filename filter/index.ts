import path from 'path';
import { writeFileSync } from 'fs';
import { read, Case } from '../collect-companys-detail';

interface Lawer {
  name: string;
  url: string;
  selfCaseNum: number;
  companyCaseNum: number;
  haidianCourtNum: number;
  cases: Omit<Case, 'lawer'>[];
}
interface Lawers {
  [name: string]: Lawer;
}
const filter = async (keywords: string[] = [], years: string[] = []) => {
  const detail = Object.values(read());
  let allLawers: Lawers = {};
  detail.forEach(e => {
    const lawers: Lawers = {};
    const companyCaseNum = e.cases.length;
    e.cases.forEach(ee => {
      let lawer = ee.lawer;
      if (lawer.includes('（') || lawer.includes('(')) {
        console.error('error lawer name');
      }
      let index = 1;
      while (allLawers[lawer] !== undefined) {
        lawer += '_' + index++;
      }
      delete ee.lawer;
      if (!lawers[lawer]) {
        lawers[lawer] = {
          name: e.name,
          url: e.url,
          companyCaseNum,
          haidianCourtNum: 0,
          selfCaseNum: 0,
          cases: [],
        };
      }
      lawers[lawer].selfCaseNum += 1;
      if (ee.court.includes('北京市海淀区人民法院')) {
        lawers[lawer].haidianCourtNum += 1;
      }
      if (
        (keywords.length === 0 ||
          keywords.some(keyword => ee.name.includes(keyword))) &&
        (years.length === 0 || years.some(year => ee.time === year))
      ) {
        lawers[lawer].cases.push(ee);
      }
    });
    allLawers = { ...allLawers, ...lawers };
  });
  const entries = Object.entries(allLawers);
  entries.sort((a, b) => {
    if (b[1].cases.length !== a[1].cases.length) {
      return b[1].cases.length - a[1].cases.length;
    }
    if (b[1].haidianCourtNum !== a[1].haidianCourtNum) {
      return b[1].haidianCourtNum - a[1].haidianCourtNum;
    }
    if (b[1].selfCaseNum !== a[1].selfCaseNum) {
      return b[1].selfCaseNum - a[1].selfCaseNum;
    }
    return b[1].companyCaseNum - a[1].companyCaseNum;
  });
  writeFileSync(
    path.join(process.cwd(), 'lawer.json'),
    JSON.stringify(entries, null, 2),
  );
};
filter(['遗嘱']);
