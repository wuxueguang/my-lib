// @ts-nocheck

interface Tracker {
  getSid: () => string;
  getDid: () => string;
  getKey: () => string;
  identify: (id: string, data?: Object, callback?: () => void) => void;
  track: (id: string, data?: Object, callback?: () => void) => void;
  setSuperProperty: (props: { [key: string]: string }) => void;
  setUserProperties: (props: { [key: string]: string }) => void;
  // trackRevenue: (a: any) => void;
}
class ZhuGe {
  // private tracker: Tracker;
  constructor() {}
  getSid() {
    if (!window.zhuge) return;
    return window.zhuge.getSid();
  }
  getDid() {
    if (!window.zhuge) return;
    return window.zhuge.getDid();
  }
  getKey() {
    if (!window.zhuge) return;
    return window.zhuge.getDid();
  }
  identify(id: string, data: Object | undefined, callback: (() => void) | undefined) {
    if (!window.zhuge) return;
    window.zhuge.identify(id, data, callback);
  }
  track(id: string, data?: Object, callback?: () => void) {
    if (!window.zhuge) return;
    window.zhuge.track(id, data, callback);
  }
  setSuperProperty(props: { [key: string]: string }) {
    if (!window.zhuge) return;
    window.zhuge.setSuperProperty(props);
  }
  setUserProperties(props: { [key: string]: string }) {
    if (!window.zhuge) return;
    window.zhuge.setUserProperties(props);
  }
  // trackRevenue() {
  // }
}
const zhuge = new ZhuGe();
export default zhuge;