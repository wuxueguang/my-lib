import _ from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Spin, Space } from 'antd';
import LoaderMore from '@yg-cube/pro-load-more';
import SearchFilter from '@yg-cube/pro-searchFilter';
import ProCard from '@yg-cube/pro-card';

const PAGE_SIZE = 40;

interface SearchParams {
  pageNum: number;
  pageSize: number;
  [x: string]: any;
}

interface SearchBaseProps {
  pageSize?: number;
  searchFilterProps?: any;
  toolbarRender?(): JSX.Element | null;
  listRender?(items: any[] | null): JSX.Element | null;
  request(params: SearchParams): Promise<{ isLastPage?: boolean; total?: number; records: any[] }>;
}

const SearchBase: React.FC<SearchBaseProps> = (props) => {
  const { pageSize: _pageSize = PAGE_SIZE, listRender, toolbarRender, request: _request, searchFilterProps } = props;

  const et = useMemo(() => new EventTarget(), []);

  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [queryParams, setQueryParams] = useState({});
  const [total, setTotal] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const doQuery = useCallback(
    (_queryParams?: object, _pageNum?: number) =>
      new Promise((resolve) => {
        _queryParams = _.isObject(_queryParams) ? _queryParams : { ...queryParams };
        _pageNum = _.isNumber(_pageNum) ? _pageNum : pageNum + 1;
        _request({
          ..._queryParams,
          pageNum: _pageNum,
          pageSize: _pageSize,
        }).then(({ isLastPage = true, total, records }: any) => {
          const _items = _pageNum === 1 ? records : [...(items || []), ...records];
          setTotal(total);
          setItems(_items);
          setPageNum(_pageNum!);
          setQueryParams({ ..._queryParams });
          setIsLastPage(typeof isLastPage === 'boolean' ? isLastPage : Number(total) <= _pageSize * _pageNum!);
          resolve([]);
        });
      }),
    [_pageSize, _request, items, pageNum, queryParams],
  );

  const searchHandler = useCallback(
    async ({ form, filter, sort }: any) => {
      const params = { ...form, ...filter, sort };

      // 处理字符串：删除首尾空字符、删除空字符、undefined
      Object.entries(params).forEach(([key, value]: [string, any]) => {
        params[key] = _.isString(value) ? value.trim() : value;

        if (value === undefined || (_.isString(value) && value.trim().length === 0)) {
          delete params[key];
        }
      });

      setLoading(true);
      try {
        await doQuery(params, 1);
      } finally {
        setLoading(false);
      }
    },
    [doQuery],
  );

  useEffect(() => {
    const _handler = () => {
      doQuery().then(() => {
        et.dispatchEvent(new CustomEvent('loadMoreEnd'));
      });
    };
    et.addEventListener('loadMoreStart', _handler);

    return () => et.removeEventListener('loadMoreStart', _handler);
  }, [doQuery, et]);

  const loadMoreRequest = useCallback(
    () =>
      new Promise((resolve) => {
        Promise.resolve().then(() => {
          et.dispatchEvent(new CustomEvent('loadMoreStart'));
        });
        const handler = (e: any) => {
          resolve(e.detail);
          et.removeEventListener('loadMoreEnd', handler);
        };
        et.addEventListener('loadMoreEnd', handler);
      }),
    [et],
  );

  const toolBar = toolbarRender ? toolbarRender() : null;
  const list = listRender ? listRender(items) : null;

  return (
    <Spin spinning={false}>
      <Space style={{ width: '100%' }} size={16} direction="vertical">
        <SearchFilter {...searchFilterProps} onSearch={searchHandler} total={total} />
        <ProCard ghost>
          {Boolean(toolBar) && (
            <div style={{ padding: '16px 16px 0 16px', background: '#fff' }}>
              <div style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>{toolBar}</div>
            </div>
          )}
          <LoaderMore actionType="auto" noMore={isLastPage} loading={loading} request={loadMoreRequest}>
            {<ProCard>{list}</ProCard>}
          </LoaderMore>
        </ProCard>
      </Space>
    </Spin>
  );
};

export default SearchBase;
