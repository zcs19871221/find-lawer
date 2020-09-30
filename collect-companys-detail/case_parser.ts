import { Case } from './operater';
import collecVerdict from './collect-verdict';

class MainParser {
  isNext: boolean = true;
  isRecord: boolean = true;
  caseInfo: Case = this.initCaseInfo();
  tdLen: number = 6;
  index: number = 0;
  parsers: Parser[];
  constructor(parsers: Parser[]) {
    this.parsers = parsers;
  }

  parse(td: string) {
    this.parsers.forEach(p => {
      if (p.isMatch(this)) {
        p.handle(td, this);
      }
    });
  }

  initCaseInfo(): Case {
    return {
      time: '',
      number: '',
      name: '',
      detailLink: '',
      lawer: '',
      court: '',
    };
  }

  removeTag(td: string) {
    return td.replace('<span>', '').replace('</span>', '');
  }

  getOffset(): number {
    return this.index % this.tdLen;
  }

  canHandle() {
    return this.isRecord && this.isNext;
  }
}

interface Parser {
  isMatch(parser: MainParser): boolean;
  handle(td: string, parser: MainParser): void;
}

class PublishTimeParser implements Parser {
  isMatch(parser: MainParser): boolean {
    return parser.canHandle() && parser.getOffset() === 1;
  }

  handle(td: string, parser: MainParser) {
    const publishTime = parser.removeTag(td);
    if (new Date(publishTime).getTime() < new Date('2019-01-01').getTime()) {
      parser.isNext = false;
      parser.isRecord = false;
    }
  }
}

class NumberParser implements Parser {
  private filterYears: number[];
  private filterLocate: string;
  constructor(filterYears: number[], filterLocate: string) {
    this.filterYears = filterYears;
    this.filterLocate = filterLocate;
  }

  isMatch(parser: MainParser): boolean {
    return parser.canHandle() && parser.getOffset() === 2;
  }

  handle(td: string, parser: MainParser) {
    const number = parser.removeTag(td);
    const matched = number.match(
      new RegExp(
        `^[(（](${this.filterYears.join('|')})[)）]${this.filterLocate}`,
      ),
    );
    if (!matched || !matched[1]) {
      parser.isRecord = false;
    } else {
      parser.caseInfo.number = number;
      parser.caseInfo.time = matched[1];
    }
  }
}

class NameParser implements Parser {
  private keywords: string[];
  constructor(keywords: string[]) {
    this.keywords = keywords;
  }
  isMatch(parser: MainParser): boolean {
    return parser.canHandle() && parser.getOffset() === 3;
  }

  handle(td: string, parser: MainParser) {
    const name = parser.removeTag(td);
    if (this.keywords.some(keyword => name.includes(keyword))) {
      parser.caseInfo.name = name;
      return;
    }
    parser.isRecord = false;
  }
}

class DetailParser implements Parser {
  private tasks: Promise<any>[];
  private id: string;
  private cookie: string;
  constructor(tasks: Promise<any>[], id: string, cookie: string) {
    this.tasks = tasks;
    this.id = id;
    this.cookie = cookie;
  }

  isMatch(parser: MainParser): boolean {
    return parser.canHandle() && parser.getOffset() === 5;
  }

  handle(td: string, parser: MainParser) {
    const caseInfo = parser.caseInfo;
    const href = td.match(/href="([^"]+)"/);
    if (href && href[1]) {
      const detailLink = href[1];
      caseInfo.detailLink = detailLink;
      if (detailLink) {
        this.tasks.push(
          collecVerdict({ detailLink, id: this.id, cookie: this.cookie }).then(
            verdictInfo => {
              caseInfo.lawer = verdictInfo.lawer;
              caseInfo.court = verdictInfo.court;
            },
          ),
        );
      }
    }
  }
}

class EndParser implements Parser {
  private cases: Case[];
  constructor(cases: Case[]) {
    this.cases = cases;
  }

  isMatch(parser: MainParser): boolean {
    return parser.isNext;
  }

  handle(_td: string, parser: MainParser) {
    if (parser.getOffset() === 5) {
      if (parser.isRecord) {
        const caseInfo = parser.caseInfo;
        this.cases.push(caseInfo);
      }
      parser.caseInfo = parser.initCaseInfo();
      parser.index = 0;
      parser.isRecord = true;
    } else {
      parser.index++;
    }
  }
}

export default MainParser;
export { PublishTimeParser, NumberParser, NameParser, DetailParser, EndParser };
