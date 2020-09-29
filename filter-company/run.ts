import { read } from '../collect-companys';
import filterByCase from './filter-by-case';
import { get } from '../cookie';

(async function runFilter() {
  try {
    const infos = Object.entries(read());
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
