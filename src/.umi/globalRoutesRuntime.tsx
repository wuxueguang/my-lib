// @ts-nocheck
import { globalRoutes, zhuge } from 'umi';
 
const getRefferPageName = () => {
  const key = 'refferPagesList';
  const sourceString = localStorage.getItem(key) || '[{"title":"","pathname":""}]';
  const records = JSON.parse(sourceString);
  function currentNotExist(){
    let exist = false;
    records.forEach(function(element){
      if (element.pathname === window.location.pathname) {
        exist = true;
      }
    });
    if (records.length < 2) return true;
    if (records[1].pathname !== window.location.pathname) return true;
    return !exist;
  }
  if (currentNotExist()) {
    records.push({
      title: document.title,
      pathname: window.location.pathname,
    });
    if (records.length > 2) {
      records.shift();
    }
    localStorage.setItem(key, JSON.stringify(records));
  }
  return records[0].title;
};
export function patchRoutes({ routes }) {
  globalRoutes.setGlobalRoutes(routes);
}
export function onRouteChange({ matchedRoutes }) {
  if (matchedRoutes.length) {
    const { title } = matchedRoutes[matchedRoutes.length - 1].route;
    if (true) {
      document.title = title ? title + ' | ' + '阳光智采' : '阳光智采';
    } else {
      document.title = title ? title : '阳光智采';
      ;
    }
    zhuge && zhuge.setSuperProperty({
      '当前页面名称': document.title,
      '来源页面名称': getRefferPageName(),
    })
  }
}
