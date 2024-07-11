// @ts-nocheck
import React from 'react';
import { RequestProvider } from '@ygfish/plugin-request';
export function rootContainer(container:any) {
  return React.createElement(RequestProvider, null, container);
}