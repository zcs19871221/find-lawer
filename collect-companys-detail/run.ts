import { read, LawCompanyInfo } from '../collect-companys';
import filterByCase from './collect';
import { get } from '../cookie';

const extra: LawCompanyInfo = {
  '3077532003': '北京市汉卓律师事务所',
};
(async function runFilter() {
  try {
    let infos;
    if (extra) {
      infos = Object.entries(extra);
    } else {
      infos = Object.entries(read());
    }
    const cookie = get();
    while (infos.length > 0) {
      const batched = infos.splice(0, 20);
      await Promise.all(
        batched.map(each =>
          filterByCase({ id: each[0], name: each[1], cookie }),
        ),
      );
      console.log('完成处理: ' + batched.map(each => each[1]));
    }
  } catch (e) {
    console.error(e);
  }
})();
