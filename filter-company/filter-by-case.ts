import Request from 'better-request';
import { write, Case } from './operater';

const filterCase = async ({
  id,
  name,
  cookie,
}: {
  id: string;
  name: string;
  cookie: string;
}) => {
  let pn = 1;
  const cases: Case[] = [];
  const removeTag = (td: string) =>
    td.replace('<span>', '').replace('</span>', '');
  let isNext = true;
  do {
    const response = await Request.fetch(
      {
        url: `https://www.tianyancha.com/pagination/caseList.xhtml`,
        search: {
          ps: 20,
          pn: pn++,
          id,
          name,
          _: Date.now(),
        },
        header: {
          'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36`,
          cookie,
        },
        method: 'GET',
      },
      null,
    );
    let initTmp: () => Case = () => ({
      time: '',
      number: '',
      name: '',
      type: '',
      detailLink: '',
    });
    let tmp = initTmp();
    let index = 0;
    if (!/<td>([\s\S]*?)<\/td>/.test(response)) {
      isNext = false;
    }
    if (!response.startsWith('<table')) {
      console.error(id + ': ' + name + '获取数据被屏蔽');
    }
    response.replace(/<td.*?>([\s\S]*?)<\/td>/g, (_match: any, td: string) => {
      if (isNext === false) {
        return;
      }
      if (index % 6 === 1) {
        tmp.time = removeTag(td);
      }
      if (index % 6 === 2) {
        tmp.number = removeTag(td);
      }
      if (index % 6 === 3) {
        tmp.name = removeTag(td);
      }
      if (index % 6 === 4) {
        tmp.type = removeTag(td);
      }
      if (index % 6 === 5) {
        const href = td.match(/href="([^"]+)"/);
        if (href && href[1]) {
          tmp.detailLink = href[1];
        }
        if (new Date(tmp.time).getTime() < new Date('2019-01-01').getTime()) {
          isNext = false;
          return;
        }
        if (tmp.name.includes('继承') || tmp.name.includes('遗嘱')) {
          cases.push(tmp);
        }
        index = 0;
        tmp = initTmp();
        return _match;
      }
      index++;
      return _match;
    });
  } while (isNext);
  if (cases.length > 0) {
    write({
      [id]: {
        name,
        url: `https://www.tianyancha.com/company/${id}`,
        cases,
      },
    });
  }
};

export default filterCase;
