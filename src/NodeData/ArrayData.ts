import { recorder, type, emit } from '.';
import ObjectData from './ObjectData';

const id = Symbol('id');
const _emit = Symbol('emit');

const transfer = (v: any, id: string) => {
  switch (type(v)) {
    case 'array':
      return makeArrayData(v, id);
    case 'object':
      return new ObjectData(v, id);
    default:
      return v;
  }
};

const obj: any = {
  [_emit](v: any) {
    recorder[this[id]][emit]();
    return v;
  },

  unshift(...items: any[]) {
    items = items.filter((item) => item !== undefined).map(((v) => transfer(v, this[id])));
    return this[_emit](Array.prototype.unshift.call(this, ...items));
  },
  push(...items: any[]) {
    items = items.filter((item) => item !== undefined).map(((v) => transfer(v, this[id])));
    return this[_emit](Array.prototype.push.call(this, ...items));
  },

  shift() {
    return this[_emit](Array.prototype.shift.call(this));
  },
  pop() {
    return this[_emit](Array.prototype.pop.call(this));
  },

  splice(start: number, deleteCount: number = Infinity, ...rest: any[]) {
    rest = rest.map((v) => transfer(v, this[id]));
    return this[_emit](Array.prototype.splice.call(this, start, deleteCount, ...rest));
  },

  clear() {
    return this[_emit](Array.prototype.splice.call(this, 0, Infinity));
  },

  valueOf() {
    return this.map((item: any) => [null, undefined].includes(item) ? item : item.valueOf());
  },
};

Reflect.setPrototypeOf(obj, Array.prototype);

const makeArrayData = (originArr: any[], _id: string) => {
  const arr: any = Array.from(originArr.map((v) => transfer(v, _id)));
  arr[id] = _id;
  Reflect.setPrototypeOf(arr, obj);
  return arr;
};

export default { makeArrayData };
