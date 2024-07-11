// @ts-nocheck
// @ts-ignore
import { ApplyPluginsType, plugin } from 'umi';
import { message } from 'antd';


import {
  extend,
  RequestOptionsInit,
  OnionMiddleware,
  RequestOptionsWithoutResponse,
  RequestOptionsWithResponse,
  RequestResponse,
  RequestMethod,
  ResponseError,
} from 'umi-request';
import { AjaxPromise } from '@@/plugin-autoService/service';

// @ts-ignore
import Cookies from 'js-cookie';

interface useMockConfig extends RequestOptionsInit {
  mock?: boolean;
}

interface RequestMethodInUmi<R = false> {
  <T = any>(url: string, options: useMockConfig): Promise<T>;
  <T = any>(url: string, options: RequestOptionsWithResponse): Promise<RequestResponse<T>>;
  <T = any>(url: string, options: RequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, options?: RequestOptionsInit): R extends true ? Promise<RequestResponse<T>> : Promise<T>;
}

export interface IResponseStructure {
  code: number | string;
  data: any;
  msg?: string;
  desc?: string;
  [key: string]: any;
}

export interface IRequestConfig extends RequestOptionsInit {
  middlewares?: OnionMiddleware[];
  useDefaultMiddleware?: boolean;
}

let requestMethodInstance: RequestMethod;

/** 修正因为Instance导致的Authorization无法重置 */
const clearRequestInstance = () => {
  requestMethodInstance = undefined;
}

/** 错误拦截处理 */
const errorHandler = (error) => {
  const codeMessage = {
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有登录（令牌、用户名、密码错误）。',
    403: '用户未得到授权。',
    404: '发出的请求针对的是不存在的记录。',
    405: '请求的方式错误。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };
  if (error.response) {
    let errortext = codeMessage[error.response.status];
    if (error.response.status === 401){
      const authKey = {cookie: 'tempauth', session: 'authorization' };
      Cookies.remove(authKey.cookie, { path: '/' });
      sessionStorage.removeItem(authKey.session);
      // 增加5次逻辑
      const unAuthTimes = sessionStorage.getItem('unauth') || 0;
      sessionStorage.setItem('unauth', parseInt(unAuthTimes)+1);
      // app单独实现返回登录
      if (bridge.isAPP()) {
        bridge.logout();
      } else {
        if (unAuthTimes < 5) {
            console.log('unAuthTimes=', unAuthTimes)
            setTimeout(function () {
              // window.location.href = window.location.host.includes('.ygyg.') ? '/login' : '/';
              window.location.reload();
            }, 1000);
          }
      }
    }else if (error.response.status >= 400) {
      if(errortext){
        message.error(errortext);
      }else{
        message.error('系统发生未知错误');
      }
    }

  }else{
    // message.error('发生未知错误');
  }
  throw error;
}

const getRequestMethod = () => {
  if (requestMethodInstance) {
    return requestMethodInstance;
  }

  const requestConfig: IRequestConfig = plugin.applyPlugins({
    key: 'request',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });

  const authorizationSession = sessionStorage.getItem('authorization');

  // 注意这里是Instantance的配置，并不会每次都运行
  // 运行时执行的动作，需要配置在拦截器或者中间件中
  requestMethodInstance = extend({
    credentials: 'omit',
    timeout: 0,
    errorHandler,
    ...requestConfig,
    prefix: 'http://api.ygyg.dev1'
  });

  const { useDefaultMiddleware = true, headers = {} } = requestConfig;

  const defaultMiddleware: OnionMiddleware = async (ctx, next) => {
    if (useDefaultMiddleware) {
      ctx.req.options.getResponse = true;
    }
    // 携带token进行请求, 之后clearRequestInstance将废弃
    if (authorizationSession) {
      ctx.req.options.headers['Authorization'] = 'Bearer' + ' ' + authorizationSession ;
    }
    // 补偿因为Safari安全策略获取Referer不完整导致的错误
    ctx.req.options.headers['x-function-path'] = location.pathname?.toLowerCase();
    // 需要支持组件开发的时候 主动配置一个'x-function-path'来测试权限
    if (process.env.NODE_ENV === 'development') {
      ctx.req.options.headers['x-function-path'] = headers['x-function-path'] ? headers['x-function-path'] : location.pathname?.toLowerCase();
    }
    
    await next();
    const { res } = ctx;
    const code = typeof res.data.code === 'string' ? Number(res.data.code) : res.data.code;
    if (useDefaultMiddleware) {
      if (code !== 0) {
        if(code < 0){
          message.error(res?.data?.message ?? '系统发生未知错误');
        }
        const err: any = new Object();
        err.response = res.response;
        err.data = res.data;
        return Promise.reject(err);
      }
      ctx.res = res.data;
    }
  };

  const customMiddlewares = [defaultMiddleware, ...(requestConfig.middlewares || [])];
  if (false) {
    customMiddlewares.push(yapi);
  }

  // Add user custom middlewares
  customMiddlewares.forEach(mw => {
    requestMethodInstance.use(mw);
  });

  // Add user custom interceptors
  const requestInterceptors = requestConfig.requestInterceptors || [];
  const responseInterceptors = requestConfig.responseInterceptors || [];
  requestInterceptors.map((ri) => {
    requestMethodInstance.interceptors.request.use(ri);
  });
  responseInterceptors.map((ri) => {
    requestMethodInstance.interceptors.response.use(ri);
  });

  return requestMethodInstance;
};

const request: RequestMethodInUmi = (url: any, options: any) => {
  const requestMethod = getRequestMethod();
  return requestMethod(url, options);
};

declare function requestErrorHandler<T>(request: AjaxPromise<T>): Promise<[{responese:any, data:T}|null, T]>;
const requestErrorHandler: Promise<[{responese:any, data:T}|null, T['data']]> = async (request:AjaxPromise<T>) => {
  try {
    const response =  await request;
    return [null, response];
  } catch (error) {
    return [error, null];
  }
}

export { request, requestErrorHandler, clearRequestInstance };
export type { OnionMiddleware, ResponseError };
