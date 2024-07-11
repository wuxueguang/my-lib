// @ts-nocheck
// @ts-nocheck
    const localDebug = {};
    class GlobalRoutesFun {
      routers: any[] = [];
      setGlobalRoutes = (routers: any[]) => {
        this.routers = [].concat(routers);
      };
      getGlobalRoutes = () => {
        return this.routers;
      };
      getGlobalDebug = () => {
        return localDebug;
      };
    };
    const getSingle = function () {
      var instance;
      return function () {
        return instance || (instance = new GlobalRoutesFun());
      }
    };
    const globalRoutes = getSingle()();
    export default globalRoutes;
    