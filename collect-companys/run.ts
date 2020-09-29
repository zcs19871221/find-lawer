import collectCompany from './collect';
import { get } from '../cookie';

(async function runCollect() {
  try {
    const cookie = get();
    await collectCompany(cookie);
  } catch (e) {
    console.error(e);
  }
})();
