import Request from 'better-request';
import { read, writeSorted } from './operater';
import { get } from '../cookie';

const filterLawer = async () => {
  const infos = Object.values(read());
  infos.sort((a, b) => b.cases.length - a.cases.length);
  for (const info of infos) {
    const names: any[] = await Promise.all(
      info.cases.map(each => {
        return Request.fetch(
          {
            url: each.detailLink,
            header: {
              'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36`,
              cookie: get(),
            },
            method: 'GET',
          },
          null,
        )
          .then(res => {
            const matched = res.match(
              new RegExp(
                `(?:诉讼|委托|委托诉讼)代理人[：:]?(.*?)[，,].*?${info.name}`,
              ),
            );
            if (matched && matched[1]) {
              return [matched[1], each.detailLink, each.name];
            }
            console.error('没找到律师姓名' + each.detailLink);
            return ['', each.detailLink, each.name];
          })
          .catch(e => {
            console.error(e);
            return ['', each.detailLink, each.name];
          });
      }),
    );
    const tmp: {
      [name: string]: [string, string][];
    } = {};
    names
      .filter(
        each => each[0] && !each[0].includes('(') && !each[0].includes('（'),
      )
      .forEach(([name, link, caseName]) => {
        if (!tmp[name]) {
          tmp[name] = [[caseName, link]];
        } else {
          tmp[name].push([caseName, link]);
        }
      });
    const sorted = Object.entries(tmp);
    sorted.sort((a: any, b) => b[1].length - a[1].length);
    delete info.cases;
    info.lawers = sorted;
  }
  writeSorted(infos);
};
filterLawer();
