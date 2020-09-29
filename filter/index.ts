import { read } from '../collect-companys-detail';

const filter = async () => {
  const detail = Object.values(read());
  detail.forEach(e => {
    e.cases.forEach(c => {});
  });
};
