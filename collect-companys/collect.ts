import Request from 'better-request';
import { write, LawCompanyInfo } from './operater';

export default async function collectCompanys(cookie: string): Promise<void> {
  let res: LawCompanyInfo = {};
  let page = 1;
  let matched: LawCompanyInfo = {};
  do {
    res = {
      ...res,
      ...matched,
    };
    matched = {};
    const response = await Request.fetch(
      {
        url: `https://www.tianyancha.com/search/p${page++}`,
        search: {
          key: '律师事务所',
          companyType: 'lawFirm',
          base: 'bj',
          areaCode: 110108,
        },
        header: {
          'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36`,
          cookie,
        },
        method: 'GET',
      },
      null,
    );
    response.replace(
      /href="https:\/\/www.tianyancha.com\/company\/(\d+)"[^>]+>([\s\S]+?)<\/a>/g,
      (_match: any, id: string, name: string) => {
        matched[id] = name
          .trim()
          .replace(/\n/g, '')
          .replace(/<em>(.*?)<\/em>/g, '$1');
      },
    );
  } while (Object.keys(matched).length > 0);
  write(res);
}
