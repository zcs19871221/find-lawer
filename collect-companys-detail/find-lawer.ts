import Request from 'better-request';

export default async function({
  detailLink,
  cookie,
  id,
}: {
  detailLink: string;
  cookie: string;
  id: string;
}) {
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
      const matched = res.match(
        new RegExp(
          `(?:诉讼|委托|委托诉讼)代理人[：:,，]?([^，,\S]+?)[，,]\\\\u003Ca href=\\\\"[^"]+?${id}`,
        ),
      );
      if (matched && matched[1]) {
        return matched[1];
      }
      throw new Error('没找到律师姓名:' + detailLink);
    })
    .catch(e => {
      console.error(e);
      return '';
    });
}
