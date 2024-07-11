import React, { useState, useEffect, useCallback, useMemo, useImperativeHandle, forwardRef, Ref } from 'react';
import SearchFilter from '@yg-cube/pro-search-filter';
import LoaderMore from '@yg-cube/pro-load-more';
import ProCard from '@yg-cube/pro-card';
import { Spin, Space, Pagination } from 'antd';
import _ from 'lodash';
// import { getSearchParams } from '@/pages/Smartcontractsign/SupplyChainCompany/utils';

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

export interface APIs {
  reload: () => void;
}

const SearchBase = forwardRef<APIs, SearchBaseProps>((props, ref) => {
  const { pageSize: _pageSize = PAGE_SIZE, listRender = () => null, toolbarRender = () => null, request: _request, searchFilterProps, fields } = props;
  // const { icate: identityCategory, eid: enterpriseId } = getSearchParams(['icate', 'eid']);

  const [requesting, setRequesting] = useState(false);

  const [pageNum, setPageNum] = useState(0);
  const [queryParams, setQueryParams] = useState({});
  const [total, setTotal] = useState<number>(0);
  const [items, setItems] = useState<any[]>([]);

  const doQuery = useCallback(
    (_queryParams?: object, _pageNum?: number) => {
      _queryParams = _.isObject(_queryParams) ? _queryParams : { ...queryParams };
      _pageNum = _.isNumber(_pageNum) ? _pageNum : pageNum + 1;

      setRequesting(true);
      return Promise.resolve(
        _request({
          ..._queryParams,
          pageNum: _pageNum,
          pageSize: _pageSize,
        }),
      ).then(({ total, records }: any) => {
        setTotal(total as number);
        setItems(records as any[]);
        setPageNum(_pageNum!);
        setQueryParams({ ..._queryParams });
      })
        .finally(() => {
          setRequesting(false);
        });
    },
    [_pageSize, _request, pageNum, queryParams],
  );

  const searchHandler = useCallback(
    ({ form, filter }: { form: Record<string, any>; filter: Record<string, any>; }) => {
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

  const toolBar = toolbarRender();

  useImperativeHandle(
    ref,
    function () {
      return {
        reload() {
          doQuery(queryParams, 1);
        },
      };
    },
    [doQuery, queryParams],
  );

  useEffect(() => {
    searchHandler({ form: { pageNum: 1, pageSize: PAGE_SIZE }, filter: {} });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space style={{ width: '100%' }} size={16} direction="vertical">
      <SearchFilter fields={fields} {...searchFilterProps} onSearch={searchHandler} total={total} />
      <ProCard ghost>
        {Boolean(toolBar) && (
          <div style={{ padding: '16px 16px 0 16px', background: '#fff' }}>
            <div style={{ paddingBottom: 16 }}>{toolBar}</div>
          </div>
        )}
        {listRender(items, { loading: requesting })}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            onChange={(pageNum: number) => {
              setPageNum(pageNum);
              doQuery({}, pageNum);
            }}
          />
        </div>
        {/* <LoaderMore actionType="auto" noMore={isLastPage} loading={requesting} request={loadMoreRequest}>
          <>{listRender(items, { loading: requesting })}</>
        </LoaderMore> */}
      </ProCard>
    </Space>
  );
});

export default SearchBase;
