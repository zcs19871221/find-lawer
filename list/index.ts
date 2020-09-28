import Request from 'better-request';

export default async function getList(cookie: string) {
  const response = await Request.fetch(
    {
      url: 'https://www.tianyancha.com/search',
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
  const matched: { id: string; name: string }[] = [];
  response.replace(
    /href="https:\/\/www.tianyancha.com\/company\/(\d+)"[^>]+>([\s\S]+?)<\/a>/g,
    (_match: any, id: string, name: string) => {
      matched.push({
        id,
        name: name
          .trim()
          .replace(/\n/g, '')
          .replace(/<em>(.*?)<\/em>/g, '$1'),
      });
    },
  );
  return matched;
}

const filterCase = async ({
  id,
  name,
  cookie,
}: {
  id: string;
  name: string;
  cookie: string;
}) => {
  do {
    const response = await Request.fetch(
      {
        url: `https://www.tianyancha.com/pagination/caseList.xhtml?ps=20&pn=1&id=3077527763&name=%E5%8C%97%E4%BA%AC%E5%B8%82%E4%B8%AD%E5%85%B3%E5%BE%8B%E5%B8%88%E4%BA%8B%E5%8A%A1%E6%89%80&_=1601299985435`,
        search: {
          ps: 20,
          pn: 1,
          id,
          name,
        },
        header: {
          'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36`,
          cookie,
        },
        method: 'GET',
      },
      null,
    );
    response.replace(/<tbody>([\s\S]+)<\/tbody>/g, (_match: any, content: string) => {
      content.replace(/<tr>\s\S+</tr > /g, tds => {
          tds.replace(/<td>)
        })
    })
  } while (true);
};
console.log(filterCase);
getList(
  `aliyungf_tc=AQAAADQ5w0rh0gcASYKB3v48K/oDkz5K; csrfToken=ZgUO15kuFLAWm7Gf7cU1KM0E; jsid=SEO-BING-ALL-SY-000001; TYCID=26a384d0018911eb855cf776ee61cdcb; ssuid=7286875488; bannerFlag=true; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1601297415; _ga=GA1.2.725794631.1601297416; _gid=GA1.2.1404939517.1601297416; tyc-user-info={%22claimEditPoint%22:%220%22%2C%22vipToMonth%22:%22false%22%2C%22explainPoint%22:%220%22%2C%22personalClaimType%22:%22none%22%2C%22integrity%22:%2210%25%22%2C%22state%22:%220%22%2C%22score%22:%226%22%2C%22announcementPoint%22:%220%22%2C%22messageShowRedPoint%22:%220%22%2C%22bidSubscribe%22:%22-1%22%2C%22vipManager%22:%220%22%2C%22onum%22:%220%22%2C%22monitorUnreadCount%22:%220%22%2C%22discussCommendCount%22:%220%22%2C%22showPost%22:null%2C%22messageBubbleCount%22:%220%22%2C%22claimPoint%22:%220%22%2C%22token%22:%22eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzY5OTE1Mzg0MCIsImlhdCI6MTYwMTI5NzY3MCwiZXhwIjoxNjMyODMzNjcwfQ.6pIRqDHZjHRCA74xtvv7OgStuOwUgIorhycNkacVrtDJhS_IVvJFIyAumGutl7l2tuOyV6SsGiBj2kh_nKKhww%22%2C%22schoolAuthStatus%22:%222%22%2C%22userId%22:%22221784672%22%2C%22scoreUnit%22:%22%22%2C%22redPoint%22:%220%22%2C%22myTidings%22:%220%22%2C%22companyAuthStatus%22:%222%22%2C%22originalScore%22:%226%22%2C%22myAnswerCount%22:%220%22%2C%22myQuestionCount%22:%220%22%2C%22signUp%22:%220%22%2C%22privateMessagePointWeb%22:%220%22%2C%22nickname%22:%22%E5%90%95%E5%B8%83%22%2C%22privateMessagePoint%22:%220%22%2C%22bossStatus%22:%222%22%2C%22isClaim%22:%220%22%2C%22yellowDiamondEndTime%22:%220%22%2C%22yellowDiamondStatus%22:%22-1%22%2C%22pleaseAnswerCount%22:%220%22%2C%22bizCardUnread%22:%220%22%2C%22vnum%22:%220%22%2C%22mobile%22:%2213699153840%22}; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzY5OTE1Mzg0MCIsImlhdCI6MTYwMTI5NzY3MCwiZXhwIjoxNjMyODMzNjcwfQ.6pIRqDHZjHRCA74xtvv7OgStuOwUgIorhycNkacVrtDJhS_IVvJFIyAumGutl7l2tuOyV6SsGiBj2kh_nKKhww; tyc-user-phone=%255B%252213699153840%2522%255D; token=688bb3af23db4322886eaec085d9894c; _utm=d29d502598f7499b821fde9243f29540; _gat_gtag_UA_123487620_1=1; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1601298987`,
);
