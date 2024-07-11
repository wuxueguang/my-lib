import { recorder, type, emit } from '.';
import ArrayData from './ArrayData';

const existedKeys = Symbol('existed keys');
const transfer = Symbol('transter');
const data = Symbol('data');
const id = Symbol('id');

class ObjectData {
  [x: string]: any;

  private [id]: string;
  private [existedKeys]: string[] = [];
  private [data]: { [x: string]: any } = {};
  private [transfer](value: any) {
    switch (type(value)) {
      case 'array':
        return ArrayData.makeArrayData(value, this[id]);
      case 'object':
        return new ObjectData(value, this[id]);
      default:
        return value;
    }
  }

  constructor(obj: { [x: string]: any }, _id: string) {
    this[id] = _id;
    for (const [key, value] of Object.entries(obj)) {
      this.setProperty(key, value, false);
    }
  }

  setProperty(key: string, v: any, needEmit: boolean = true) {
    this[data][key] = this[transfer](v);

    if (!this[existedKeys].includes(key)) {
      this[existedKeys].push(key);

      Object.defineProperty(this, key, {
        get: () => this[data][key],
        set: (v: any) => {
          this[data][key] = this[transfer](v);
          recorder[this[id]][emit]();
        },
      });
    }

    needEmit && recorder[this[id]][emit]();
  }

  valueOf() {
    return Object.entries(this[data]).reduce((ret: { [x: string]: any }, [key, value]) => {
      ret[key] = [undefined, null].includes(value) ? value : value.valueOf();
      return ret;
    }, {});
  }

}

export default ObjectData;
