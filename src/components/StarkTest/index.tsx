import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { store } from '@ice/stark-data';
import { v4 as uuid } from 'uuid';
import get from 'lodash/get';
import './styles.less';

interface NodeProps {
  id: string,
}

const Node: React.FC<NodeProps> = ({ id }) => {
  const aRef = useRef<any>();
  const [data, setData] = useState(store.get(id));

  useEffect(() => {
    const handler = (data: any) => setData(data);
    store.on(id, handler);
    return () => store.off(id, handler);
  }, [id]);

  const changeData = useCallback(() => {
    store.set(id, { value: uuid() });
  }, [id]);

  useEffect(() => {
    setInterval(() => {
      aRef.current.click();
    }, 1000);
  }, []);

  return (
    <li><a ref={aRef} onClick={changeData}>{JSON.stringify(data)}</a></li>
  );
};

const Root = () => {
  const id = useMemo(uuid, []);
  const btnRef = useRef<any>();
  const [data, setData] = useState(store.get(id) || { children: [] });

  useEffect(() => {
    const handler = (data: any) => setData(data);
    store.on(id, handler);
    return () => store.off(id, handler);
  }, [id]);

  const addChild = useCallback(() => {
    const childId = uuid();
    data.children.push(childId);
    store.set(childId, { value: uuid() });
    store.set(id, {...data});
  }, [data, id]);

  useEffect(() => {
    store.set('test', 'test');
    store.on('test', (val: string) => console.log(val));

    setTimeout(() => {
      store.set('test', 'test');
    }, 1000);
  }, []);

  // useEffect(() => {
  //   setInterval(() => {
  //     btnRef.current.click();
  //   }, 500);
  // }, []);

  return (
    <>
      <button ref={btnRef} onClick={addChild}>ADD</button>
      <ul>{data.children.map((childId: string) => <Node key={childId} id={childId} />)}</ul>
    </>
  );
};

export default Root;
