// @ts-nocheck
import React from 'react';
import { Spin } from 'antd';

export default function DefaultDynamicLoading() {
  return (
    <div style={{width: '100%', height: 'calc(100vh - 48px)', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Spin size="large" />
    </div>
  );
}