import { read as readList } from '../collect-companys';
import filterByCase from './collect';
import { read as readDetail } from './operater';
import { get } from '../cookie';

(async function runFilter() {
  try {
    const infos = Object.entries(readList());
    const details = readDetail();
    const cookie = get();
    while (infos.length > 0) {
      const batched = infos
        .splice(0, 5)
        .filter(each => details[each[0]] === undefined);
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
