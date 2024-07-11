import { recorder, NodeData, emit } from '.';

const id = Symbol('id');
const _emit = Symbol('emit');

const getObj = <T>() => ({
  [_emit](v: any) {
    recorder[this[id]][emit]();
    return v;
  },

  unshift(...items: T[]) {
    const _items = items.filter((item) => item !== undefined).map((v) => new NodeData(v, this[id]));
    return this[_emit](Array.prototype.unshift.call(this, ..._items));
  },
  push(...items: T[]) {
    const _items = items.filter((item) => item !== undefined).map((v) => new NodeData(v, this[id]));
    return this[_emit](Array.prototype.push.call(this, ..._items));
  },

  pop() {
    return this[_emit](Array.prototype.pop.call(this));
  },

  shift() {
    return this[_emit](Array.prototype.shift.call(this));
  },

  splice(start: number, deleteCount: number = Infinity, ...rest: T[]) {
    const _rest = rest.map((v) => new NodeData(v, this[id]));
    return this[_emit](Array.prototype.splice.call(this, start, deleteCount, ..._rest));
  },

  clear() {
    return this[_emit](Array.prototype.splice.call(this, 0, Infinity));
  },

  valueOf() {
    return (this as unknown as NodeData[]).map((item: any) => [null, undefined].includes(item) ? item : item.valueOf());
  },
} as any);

export const makeArrayNodeData = <T>(originArr: T[], _id: string) => {
  const arr: any = Array.from(originArr.map((item) => new NodeData(item, _id)));
  arr[id] = _id;

  const obj = getObj<T>();
  Reflect.setPrototypeOf(obj, Array.prototype);
  Reflect.setPrototypeOf(arr, obj);

  return arr;
};

export default { makeArrayNodeData };
