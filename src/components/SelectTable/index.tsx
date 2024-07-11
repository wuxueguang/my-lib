import _ from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createStore, Store } from 'redux';
import { Space, Pagination } from 'antd';
import ProTable from '@yg-cube/pro-table';
import { ProTableField, ProTableSearchOptions, ProTableProps } from '@yg-cube/pro-table/lib/typings';
import { createReducer } from '../../utils/store';

interface SelectTableProps extends Omit<ProTableProps, 'request' | 'rowKey'> {
  store?: Store;
  rowKey: string;
  nativePager?: boolean;
  selectedItems?: any[];
  fields?: ProTableField[];
  defaultSelectedItems?: any[];
  request(values: { pageSize: number; pageNum: number; [x: string]: any }): Promise<{ total: number; records: any[] }>;
}

const ALL = 'all';
const SELECTED = 'selected';

const SelectTable = (props: SelectTableProps) => {

  const {
    store,
    request,
    fields = [],
    columns = [],
    rowKey = 'id',
    nativePager = false,
    pagination: _pagination,
    rowSelection: _rowSelection = {},
    selectedItems: _selectedItems,
    defaultSelectedItems = [],
    ...others
  } = props;

  const [selectedItemsMap] = useState<{ [key: string]: any }>({});
  const [curTabKey, setCurTabKey] = useState<string>('all');

  const [searchParams, setSearchParams] = useState<any>({ pageNum: 1, pageSize: 10 });

  const [querying, setQuerying] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>(_selectedItems || defaultSelectedItems);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  useEffect(() => {
    if (_selectedItems) {
      setSelectedItems(_selectedItems);
    }
  }, [_selectedItems]);

  useEffect(() => {
    setQuerying(true);
    request(searchParams)
      .then(({ total: _total, records: _currentItems }) => {
        setCurrentItems(_currentItems);
        setTotal(_total);
      })
      .finally(() => {
        setQuerying(false);
      });
  }, [request, searchParams]);

  useEffect(() => {
    const _selectedKeys: React.Key[] = [];
    selectedItems.forEach((_chosenItem) => {
      selectedItemsMap[_chosenItem[rowKey]] = _chosenItem;

      if (currentItems.some((_item) => _item[rowKey] === _chosenItem[rowKey])) {
        _selectedKeys.push(_chosenItem[rowKey]);
      }
    });
    setSelectedRowKeys(_selectedKeys);
  }, [selectedItems, selectedItemsMap, currentItems, rowKey]);

  useEffect(() => {
    store?.dispatch({ type: SELECTED, payload: selectedItems });
  }, [selectedItems, store]);

  const rowSelection = useMemo(
    () =>
      curTabKey === 'all'
        ? {
          ..._rowSelection,
          selectedRowKeys,
          onChange(_selectedRowKeys: any[], _selectedRows: any[]) {
            _selectedRowKeys.forEach((_keyValue: string, _idx: number) => {
              if (!selectedRowKeys.includes(_keyValue)) {
                // 新增项
                selectedItemsMap[_keyValue] = _selectedRows[_idx];
              }
            });
            selectedRowKeys.forEach((_keyValue: string, _idx: number) => {
              if (!_selectedRowKeys.includes(_keyValue)) {
                // 删除项
                delete selectedItemsMap[_keyValue];
              }
            });
            setSelectedItems(Object.entries(selectedItemsMap).map(([, _item]) => _item));
            setSelectedRowKeys(_selectedRowKeys);
          },
        }
        : undefined,
    [_rowSelection, selectedItemsMap, curTabKey, selectedRowKeys],
  );

  const tabOptions = useMemo(
    () => ({
      name: 'selectTable',
      options: [{
        tab: '全部',
        key: ALL,
      }, {
        tab: `已选择 ${selectedItems.length}`,
        key: SELECTED,
      }],
      onChange(activeKey: string) {
        setCurTabKey(activeKey);
      },
    }),
    [selectedItems.length],
  );

  const dataSource = useMemo(() => (curTabKey === ALL ? currentItems : selectedItems), [selectedItems, curTabKey, currentItems]);
  const _columns = useMemo(
    () =>
      curTabKey === ALL
        ? columns
        : [
          ...columns,
          {
            title: '操作',
            width: 60,
            fixed: 'right',
            dataIndex: rowKey,
            render(_keyValue: string) {
              return (
                <a
                  onClick={() => {
                    delete selectedItemsMap[_keyValue];
                    setSelectedItems(selectedItems.filter((_item: any) => _item[rowKey] !== _keyValue));
                    setSelectedRowKeys(selectedRowKeys.filter((__keyValue) => __keyValue !== _keyValue));
                  }}
                >
                    移除
                </a>
              );
            },
          },
        ],
    [selectedItems, selectedItemsMap, columns, curTabKey, rowKey, selectedRowKeys],
  );

  const pagination = useMemo(
    () => ({
      defaultPageSize: 10,
      hideOnSinglePage: true,
      ..._pagination,

      total,
      current: searchParams.pageNum,
      onChange(current: number, pageSize: number) { // current change || pageSize change
        if (pageSize !== searchParams.pageSize) {
          setSearchParams({ ...searchParams, pageNum: 1, pageSize });
        } else {
          setSearchParams({ ...searchParams, pageNum: current });
        }
      },
    }),
    [_pagination, searchParams, total],
  );

  const searchOptions: ProTableSearchOptions = useMemo(
    () => ({
      fields,
      onSearch(values) {
        setSearchParams({ ...values, pageNum: 1 });
      },
      onReset() {
        if (!_.isEmpty(searchParams)) {
          setSearchParams({ pageNum: 1 });
        }
        return Promise.resolve();
      },
    }),
    [fields, searchParams],
  );

  return (
    <Space direction="vertical" style={{width: '100%'}} size={16}>
      <ProTable
        size="small"
        {...others}
        rowKey={rowKey}
        loading={querying}
        columns={_columns as any}
        dataSource={dataSource}
        rowSelection={rowSelection}
        tabOptions={tabOptions}
        searchOptions={searchOptions}
        pagination={nativePager && _pagination}
      />
      {!nativePager && (
        <div style={{ textAlign: 'center' }}>
          <Pagination {...pagination} />
        </div>
      )}
    </Space>
  );
};

const reducer = createReducer();

const useSelectTable = (): [React.FC<Omit<SelectTableProps, 'store'>>, () => any] => {
  const store = useMemo(() => createStore(reducer), []);
  const getSelectedItems = useCallback(() => store.getState()[SELECTED], [store]);
  const SelectTableWrapped = useCallback((props) => <SelectTable {...props} store={store} />, [store]);

  return [SelectTableWrapped, getSelectedItems];
};

export { SelectTable, useSelectTable };

export default useSelectTable;
