// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '/Users/wuxueguang/Working/my-lib/src/app.ts';
import * as Plugin_1 from '../plugin-initial-state/runtime';
import * as Plugin_2 from '../plugin-model/runtime';
import * as Plugin_3 from '/Users/wuxueguang/Working/my-lib/src/.umi/globalRequestRuntime.tsx';
import * as Plugin_4 from '/Users/wuxueguang/Working/my-lib/src/.umi/globalRoutesRuntime.tsx';

  plugin.register({
    apply: Plugin_0,
    path: '/Users/wuxueguang/Working/my-lib/src/app.ts',
  });
  plugin.register({
    apply: Plugin_1,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-model/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: '/Users/wuxueguang/Working/my-lib/src/.umi/globalRequestRuntime.tsx',
  });
  plugin.register({
    apply: Plugin_4,
    path: '/Users/wuxueguang/Working/my-lib/src/.umi/globalRoutesRuntime.tsx',
  });

export const __mfsu = 1;
