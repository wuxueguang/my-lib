import React, { useState, useEffect, useCallback, useMemo, useImperativeHandle, useRef, forwardRef } from 'react';
import SearchFilter from '@yg-cube/pro-search-filter';
import LoaderMore from '@yg-cube/pro-load-more';
import ProCard from '@yg-cube/pro-card';
import { Space } from 'antd';
import _ from 'lodash';

const PAGE_SIZE = 10;

interface SearchParams {
  pageNum: number;
  pageSize: number;
  [x: string]: any;
}

export interface SearchBaseProps {
  pageSize?: number;
  fields?: any;
  searchFilterProps?: any;
  request(params: SearchParams): Promise<{ isLastPage?: boolean; total?: number; records: any[] }>;
  toolbarRender?(): JSX.Element | null;
  listRender?(items: any[] | null, ops: { loading: boolean }): JSX.Element | null;
}

const SearchBase = forwardRef<APIs, SearchBaseProps>((props, ref) => {
  const { pageSize: __pagerSize = PAGE_SIZE, listRender = () => null, toolbarRender = () => null, request: _request, searchFilterProps, fields } = props;

  const ET = useMemo(() => new EventTarget(), []);

  const [requesting, setRequesting] = useState(false);

  const [pageNum, setPageNum] = useState(0);
  const [queryParams, setQueryParams] = useState({});
  const [total, setTotal] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const doQuery = useCallback(
    (_queryParams?: object, _pageNum?: number, pageSize?: number) => {
      _queryParams = _.isObject(_queryParams) ? _queryParams : { ...queryParams };
      _pageNum = _.isNumber(_pageNum) ? _pageNum : pageNum + 1;

      return Promise.resolve(
        _request({
          ..._queryParams,
          pageNum: _pageNum,
          pageSize: pageSize ?? __pagerSize,
        }),
      ).then(({ isLastPage, total, records = [] }: any) => {
        const _items = _pageNum === 1 ? records : [...(items ?? []), ...records];

        setTotal(total as number);
        setItems(_items as any[]);
        if (!pageSize) {
          setPageNum(_pageNum!);
        }
        setQueryParams({ ..._queryParams });
        setIsLastPage(typeof isLastPage === 'boolean' ? isLastPage : Number(total) <= (pageSize ?? __pagerSize) * _pageNum!);
      });
    },
    [__pagerSize, _request, items, pageNum, queryParams],
  );

  const searchHandler = useCallback(
    ({ form, filter }: any) => {
      const params = { ...form, ...filter };

      Object.entries(params as object).forEach(([key, value]: [string, any]) => {
        params[key] = _.isString(value) ? value.trim() : value;
        if (value === undefined || (_.isString(value) && value.trim().length === 0)) {
          delete params[key];
        }
      });

      setRequesting(true);
      doQuery(params as object, 1).finally(() => {
        setRequesting(false);
      });
    },
    [doQuery],
  );

  const loadMoreRequest = useCallback(
    function (pageNum) {
      return new Promise<void>((resolve) => {
        Promise.resolve().then(() => {
          ET.dispatchEvent(new CustomEvent('loadMoreStart', { detail: { pageNum } }));
        });
        const handler = () => {
          resolve();
          ET.removeEventListener('loadMoreEnd', handler);
        };
        ET.addEventListener('loadMoreEnd', handler);
      });
    },
    [ET],
  );

  const toolBar = toolbarRender();

  useEffect(() => {
    const _handler = (e: any) => {
      interface CE {
        detail: { pageNum: number };
      }
      const {
        detail: { pageNum },
      } = e;
      if (pageNum === 1) {
        setRequesting(true);
      }
      doQuery(queryParams, (e as CE).detail.pageNum).finally(() => {
        ET.dispatchEvent(new CustomEvent('loadMoreEnd'));
        if (pageNum === 1) {
          setRequesting(false);
        }
      });
    };
    ET.addEventListener('loadMoreStart', _handler);

    return () => ET.removeEventListener('loadMoreStart', _handler);
  }, [doQuery, ET, queryParams]);

  useImperativeHandle(
    ref,
    function () {
      return {
        reload() {
          doQuery(queryParams, 1, pageNum * __pagerSize);
        },
      };
    },
    [__pagerSize, doQuery, pageNum, queryParams],
  );

  return (
    <Space style={{ width: '100%' }} size={16} direction="vertical">
      <SearchFilter fields={fields} {...searchFilterProps} onSearch={searchHandler} total={total} />
      <ProCard ghost>
        {Boolean(toolBar) && (
          <div style={{ padding: '16px 16px 0 16px', background: '#fff' }}>
            <div style={{ paddingBottom: 16 }}>{toolBar}</div>
          </div>
        )}
        <LoaderMore actionType="auto" noMore={isLastPage} loading={requesting} request={loadMoreRequest}>
          <>{listRender(items, { loading: requesting })}</>
        </LoaderMore>
      </ProCard>
    </Space>
  );
});

function useSearchList<T = Array<Record<string, any>>() {
  const ref = useRef();

};

export default SearchBase;
