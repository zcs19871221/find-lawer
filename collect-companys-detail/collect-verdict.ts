import Request from 'better-request';

const findLawer = (res: string, detailLink: string, id: string) => {
  const matched = res.match(
    new RegExp(
      `(?:诉讼|委托|委托诉讼)代理人[：:,，]?([^，,\S]+?)[，,]\\\\u003Ca href=\\\\"[^"]+?${id}`,
    ),
  );
  if (matched && matched[1]) {
    return matched[1];
  }
  console.error('没找到律师姓名:' + detailLink);
  return '';
};
const findCourt = (res: string, detailLink: string) => {
  const matched = res.match(/审理法院<\/span>[：:]<span>([^<]+)</);
  if (matched && matched[1]) {
    return matched[1];
  }
  console.error('没找到法院名称:' + detailLink);
  return '';
};
export default async function collectVerdict({
  detailLink,
  cookie,
  id,
}: {
  detailLink: string;
  cookie: string;
  id: string;
}): Promise<{ lawer: string; court: string }> {
  return Request.fetch(
    {
      url: detailLink,
      header: {
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36`,
        cookie,
      },
      method: 'GET',
    },
    null,
  )
    .then(res => {
      return {
        lawer: findLawer(res, detailLink, id),
        court: findCourt(res, detailLink),
      };
    })
    .catch(e => {
      console.error(e);
      return {
        lawer: '',
        court: '',
      };
    });
}
