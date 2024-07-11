export const attempt = (
  callback: () => PromiseLike<any>,
  ...args: any[]
) => {
  const _until = async (
    flag: boolean = true,
    resolve: (data: any) => void,
    reject: (reason: any) => void,
  ) => {
    try {
      const data = await callback.apply(args);
      flag ? resolve(data) : _until(flag, resolve, reject);
    } catch (err) {
      !flag ? resolve(err) : _until(flag, resolve, reject);
    }
  };

  return {
    untilSuccess() {
      return new Promise((...args) => {
        _until(true, ...args);
      });
    },
    untilFail() {
      return new Promise((...args) => {
        _until(false, ...args);
      });
    },
  };
};

export const type = (v: unknown) => Reflect.toString.call(v).replace(/^\[object (.*)\]$/, '$1').toLowerCase();
