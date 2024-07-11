import { v4 as uuid } from 'uuid';
import { event } from '@ice/stark-data';

import ArrayData from './ArrayData';
import ObjectData from './ObjectData';
import ArrayNodeData from './ArrayNodeData';

export const recorder: { [x: string]: NodeData } = {};

export const type = (v: unknown) => Reflect.toString.call(v).replace(/^\[object (.*)\]$/, '$1')
  .toLowerCase();

export const emit = Symbol('emit');

const existedKeys = Symbol('existed keys');
const extraData = Symbol('extra data');
const transfer = Symbol('transfer');
const st = Symbol('setTimeout');
const data = Symbol('data');

export class NodeData<T = any> {
  static nodeDataKeys: string[] = ['children'];

  [x: string]: any;
  private [st]: any = null;
  private [existedKeys]: string[] = [];
  private [data]: { [x: string]: any } = {};
  private [extraData]: { id: string, parentId?: string };

  private [transfer](value: any, key: string): any {
    if (NodeData.nodeDataKeys.includes(key)) {
      return Array.isArray(value)
        ? ArrayNodeData.makeArrayNodeData<T>(value, this[extraData].id)
        : new NodeData(value, this[extraData].id);
    }
    switch (type(value)) {
      case 'array':
        return ArrayData.makeArrayData(value, this[extraData].id);
      case 'object':
        return new ObjectData(value, this[extraData].id);
      default:
        return value;
    }
  }

  constructor(sourceData: T, parentId?: string, id: string = uuid()) {
    this[extraData] = { id, parentId };
    Reflect.defineProperty(this, '_id', { value: id, configurable: false });
    Reflect.defineProperty(this, '_parentId', { value: parentId, configurable: false });

    for (const [key, value] of Object.entries(sourceData)) {
      this.setProperty(key, value, false);
    }

    recorder[id] = this;
  }

  [emit]() { // not a private method
    if (this[st] !== null) {
      clearTimeout(this[st]);
    }
    this[st] = setTimeout(() => event.emit(this[extraData].id, this));
  }

  remove = () => {
    const parentId = this[extraData].parentId;
    if (typeof parentId === 'string') {
      const idx = recorder[parentId][data].children.get().indexOf(recorder[this[extraData].id]);
      if (idx > -1) {
        recorder[parentId].children.splice(idx, 1);
        delete recorder[this[extraData].id];
        return;
      }
    }
    console.error(new Error('NodeData is not in an array, can not be removed by remove method. It may be the root NodeData.'));
  };

  setProperty(key: string, v: any, needEmit: boolean = true) {
    this[data][key] = this[transfer](v, key);

    if (!this[existedKeys].includes(key)) {
      this[existedKeys].push(key);

      Reflect.defineProperty(this, key, {
        get: () => this[data][key],
        set: (v: any) => {
          this[data][key] = this[transfer](v, key);
          this[emit]();
        },
      });
    }

    needEmit && this[emit]();
  }

  valueOf() {
    return Object.entries(this[data]).reduce((ret: {
      [x: string]: any
    }, [key, value]) => {
      ret[key] = [undefined, null].includes(value) ? value : value.valueOf();
      return ret;
    }, {});
  }
}

export default NodeData;
