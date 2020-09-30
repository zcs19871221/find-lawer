import { read as readList } from '../collect-companys';
import filterByCase from './collect';
import { read as readDetail } from './operater';
import { get } from '../cookie';

(async function runFilter({
  year,
  locate,
  keywords,
  batch,
  overwrite,
}: {
  year: number[];
  batch: number;
  locate: string;
  keywords: string[];
  overwrite: boolean;
}) {
  try {
    const infos = Object.entries(readList());
    const details = readDetail();
    const cookie = get();
    while (infos.length > 0) {
      const batched = infos
        .splice(0, batch)
        .filter(each => overwrite || details[each[0]] === undefined);
      await Promise.all(
        batched.map(each =>
          filterByCase({
            id: each[0],
            name: each[1],
            cookie,
            year,
            locate,
            keywords,
          }),
        ),
      );
      console.log('完成处理: ' + batched.map(each => each[1]));
    }
  } catch (e) {
    console.error(e);
  }
})({
  year: [2020, 2019, 2018],
  locate: '京',
  keywords: ['继承', '遗嘱', '遗产'],
  batch: 5,
  overwrite: true,
});
