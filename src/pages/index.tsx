/* eslint-disable newline-per-chained-call */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
// import 'antd/dist/antd.css';
import React, { useState, useEffect, useMemo, memo } from 'react';
// import $ from 'jquery';
// import { Button } from 'antd';
// import { useModal } from '../utils/wrapper';
// import { useSelectTable } from '../components/SelectTable';
// import { parse, parseExpression } from '@babel/parser';
// import { store, event } from '@ice/stark-data';
// import StakTest from '../components/StarkTest';
// import generate from "@babel/generator";

// import NodeData, { recorder } from '../NodeData';

// const request = (params: any): Promise<{ total: number, records: any[] }> => {
//   console.log(params);

//   return new Promise((resolve) => setTimeout(() => {
//     resolve({ total: 555, records: Array(10).fill(0).map((_, idx) => ({ index: idx })) });
//   }, 1000));
// };`

// const Index = () => {
//   const [Modal, showModal] = useModal();
//   const [SelectTable, getSelectedItems] = useSelectTable();

//   useEffect(() => {
//     const ast = parseExpression('function test(v) {console.log(v);}');
//     console.log(ast);
//     // console.log(generate(ast).code);
//   }, []);

//   return (
//     <div>
//       <Button onClick={showModal}>open modal</Button>
//       <Modal
//         onOk={() => {
//           console.log(getSelectedItems());
//           return new Promise((resolve) => setTimeout(resolve, 1000));
//         }}
//       >
//         <SelectTable
//           rowKey="index"
//           request={request}
//           columns={[{ dataIndex: 'index', title: '序号' }]}
//         />
//       </Modal>
//     </div>
//   );
// };

// const Span: React.FC<{ text: string }> = ({ text }) => {
//   const _text = useMemo(() => {
//     console.log('======');
//     return text;
//   }, [text]);

//   console.log(text, '----');

//   return <span>{_text}</span>;
// };

// class Span extends React.PureComponent<{ text: string }> {

//   render() {
//     console.log('teetetetet');
//     return <span>{this.props.text}</span>;
//   }
// }

// const MyIndex = () => {
//   const [text] = useState('abc');
//   const [, setCounter] = useState(0);

//   useEffect(() => {
//     setInterval(() => {
//       setCounter((c: number) => c + 1);
//     }, 2000);
//   }, []);

//   return <Span text={text} />;
// };

/* const Index = () => {
  const refDiv = useRef<HTMLDivElement>();

  // useEffect(() => {
  //   console.log($('#test'));
  //   $(refDiv.current).trigger('click');

  //   store.on('test', (...args: any[]) => console.log(...args));
  //   event.on('test', (...args: any[]) => console.log(...args));

  //   setTimeout(() => {
  //     store.set('test', 'shabi');
  //   }, 1000);

  //   setTimeout(() => {
  //     event.emit('test', true);
  //   }, 3000);

  // }, []);

  // console.log('-=-=--==-=-=-=-=');
  '{}';

  // const rootData = {
  //   a: 'a',
  //   b: undefined,
  //   nums: [0, 1, 2, 3, 4],
  //   children: [
  //     {
  //       obj: {
  //         z: 'z',
  //       },
  //       eKeys: [{ zzz: 'zzz' }, [1, 2, 3], 'a', 'b', 'c'],
  //       children: [
  //         {
  //           aa: 'aa',
  //         },
  //         {
  //           bb: 'bb',
  //         },
  //       ],
  //     },
  //     {
  //       b: 'b',
  //     },
  //     {
  //       c: 'c',
  //     },
  //   ],
  // };
  // const o = new NodeData(rootData);
  // // o.valueOf();

  // event.on(o._id, (data: NodeData) => {
  //   console.log(data.valueOf());
  // });

  // event.on(o.children[0]._id, (data: NodeData) => {
  //   console.log(data.valueOf());
  // });

  // o.a = 'aaaaaaa';
  // o.setProperty('z', 'aaaaa');
  // o.setProperty('c', {});
  // o.c.setProperty('d', null);
  // o.c.d = 'sdfsdf';
  // o.children.clear();
  // o.children[0].obj.z = 44444;
  // console.log(o.nums);

  // o.nums.push({ a: 5 });
  // o.nums.get()[5].a = 234234;

  // o.children.shift();
  // o.children.shift();
  // console.log(o.children.get()[0]);
  // o.a = '2342342';
  // o.nums.push(5);
  // o.children.push({ zzz: 'sss' });
  // event.on(o.children.get()[3]._id, (data: NodeData) => console.log(data.valueOf()));
  // o.children[3].zzz = 23234;
  // o.children[3].remove();
  // o.children.push({ zzz: 'sss' });
  // o.children.push({ zzz: 'sss' });

  // o.children.get()[3].zzz = 'ggg';
  // o.children.get()[0].eKeys.get()[1].push(4);
  // o.children.get()[0].eKeys.splice(0, 1);
  // console.log(recorder);

  return (
    <Fragment key="sdfsdf">
      testetsetes
    </Fragment>
  );
}; */

export default () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  }, [count]);

  return count % 2 === 0 ? '偶数' : '基数';
};

