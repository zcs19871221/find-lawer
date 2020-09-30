import Request from 'better-request';
import { write, Case } from './operater';
import Parser, {
  PublishTimeParser,
  NumberParser,
  NameParser,
  DetailParser,
  EndParser,
} from './case_parser';

const filterCase = async ({
  id,
  name,
  cookie,
  year,
  locate,
  keywords,
}: {
  id: string;
  name: string;
  cookie: string;
  year: number[];
  locate: string;
  keywords: string[];
}) => {
  let pn = 1;
  const cases: Case[] = [];
  const getLawerTasks: Promise<any>[] = [];
  const parser = new Parser([
    new PublishTimeParser(),
    new NumberParser(year, locate),
    new NameParser(keywords),
    new DetailParser(getLawerTasks, id, cookie),
    new EndParser(cases),
  ]);
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
    if (
      !response.startsWith('<table') ||
      !/<td>([\s\S]*?)<\/td>/.test(response)
    ) {
      console.error(id + ': ' + name + '获取数据错误');
      return;
    }
    response.replace(/<td.*?>([\s\S]*?)<\/td>/g, (_match: any, td: string) => {
      parser.parse(td);
      return '';
    });
  } while (parser.isNext);
  if (cases.length > 0) {
    await Promise.all(getLawerTasks);
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
