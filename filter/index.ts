import path from 'path';
import { writeFileSync } from 'fs';
import { read, Case } from '../collect-companys-detail';

interface Lawer {
  belongCompany: {
    name: string;
    url: string;
  };
  inheritCaseStatics: {
    all: number;
    haidianCourt: number;
    '2020': number;
    '2019': number;
    '2018': number;
  };
  inheritCases: Omit<Case, 'lawer'>[];
}
interface Lawers {
  [name: string]: Lawer;
}
const filter = async (keywords: string[] = [], years: string[] = []) => {
  const detail = Object.values(read());
  let allLawers: Lawers = {};
  detail.forEach(e => {
    const lawers: Lawers = {};
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
      if (
        (keywords.length === 0 ||
          keywords.some(keyword => ee.name.includes(keyword))) &&
        (years.length === 0 || years.some(year => ee.time === year))
      ) {
        if (!lawers[lawer]) {
          lawers[lawer] = {
            belongCompany: {
              name: e.name,
              url: e.url,
            },
            inheritCaseStatics: {
              all: 0,
              haidianCourt: 0,
              '2020': 0,
              '2019': 0,
              '2018': 0,
            },
            inheritCases: [],
          };
        }
        lawers[lawer].inheritCases.push(ee);

        lawers[lawer].inheritCaseStatics.all += 1;
        if (ee.court.includes('北京市海淀区人民法院')) {
          lawers[lawer].inheritCaseStatics.haidianCourt += 1;
        }
        if (ee.time === '2020') {
          lawers[lawer].inheritCaseStatics['2020'] += 1;
        }
        if (ee.time === '2019') {
          lawers[lawer].inheritCaseStatics['2019'] += 1;
        }
        if (ee.time === '2018') {
          lawers[lawer].inheritCaseStatics['2018'] += 1;
        }
      } else {
        return [];
      }
    });

    allLawers = { ...allLawers, ...lawers };
  });
  Object.values(allLawers).forEach(e => {
    e.inheritCases.sort((a, b) => {
      if (a.court.includes('海淀') && !b.court.includes('海淀')) {
        return -1;
      }
      if (b.court.includes('海淀') && !a.court.includes('海淀')) {
        return 1;
      }
      return Number(b.time) - Number(a.time);
    });
  });
  const entries = Object.entries(allLawers);
  entries.sort((a, b) => {
    let sub: number = 0;
    sub = b[1].inheritCases.length - a[1].inheritCases.length;
    if (sub !== 0) {
      return sub;
    }
    sub =
      b[1].inheritCaseStatics.haidianCourt -
      a[1].inheritCaseStatics.haidianCourt;
    if (sub !== 0) {
      return sub;
    }
    sub = b[1].inheritCaseStatics['2020'] - a[1].inheritCaseStatics['2020'];
    if (sub !== 0) {
      return sub;
    }
    sub = b[1].inheritCaseStatics['2019'] - a[1].inheritCaseStatics['2019'];
    if (sub !== 0) {
      return sub;
    }
    sub = b[1].inheritCaseStatics['2018'] - a[1].inheritCaseStatics['2018'];
    if (sub !== 0) {
      return sub;
    }
    return sub;
  });
  writeFileSync(
    path.join(process.cwd(), 'lawer.json'),
    JSON.stringify(entries, null, 2),
  );
};
filter([], ['2018', '2019', '2020']);
