import { Reducer, createStore, Store } from 'redux';
import React, { useState, useEffect, useCallback } from 'react';
import { NumberInputProps, NumberInput, MAX_NUMBER } from './NumberInput';

const createReducer = (eventTarget: EventTarget) => {
  const reducer: Reducer = (state = {}, { type, payload }) => {
    const _state = { ...state };

    if (type) {
      _state[type] = payload;

      Promise.resolve().then(() => {
        eventTarget.dispatchEvent(new CustomEvent('storeUpdated', { detail: { type, value: payload } }));
      });
    }
    return _state;
  };

  return reducer;
};

export interface DynamicNumberInputProps extends Omit<NumberInputProps, 'onChange'> {
  maxKey?: string;
  minKey?: string;
  limitKeys?: string[];
  onChange?(value: number | null): void;
}

const eventTarget = new EventTarget();

export const store: Store = createStore(createReducer(eventTarget));

export const DynamicNumberInput = (props: DynamicNumberInputProps) => {
  const { max: _max, min: _min, maxKey, minKey, limitKeys = [], onChange, ...others } = props;

  const [st, setSt] = useState<any>();
  const [max, setMax] = useState(_max ?? MAX_NUMBER);
  const [min, setMin] = useState(_min ?? -MAX_NUMBER);

  useEffect(() => {
    const handler = (e: any) => {
      const { type, value } = e.detail;
      switch (type) {
        case maxKey:
          maxKey && setMax(value ?? MAX_NUMBER);
          break;
        case minKey:
          minKey && setMin(value ?? -MAX_NUMBER);
          break;
        default:
          break;
      }
    };
    eventTarget.addEventListener('storeUpdated', handler);

    return () => {
      eventTarget.removeEventListener('storeUpdated', handler);
    };
  }, [maxKey, minKey]);

  const _onChange = useCallback(
    (value) => {
      onChange && onChange(value);
      clearTimeout(st);
      setSt(
        setTimeout(() => {
          limitKeys.forEach((key) => {
            store.dispatch({ type: key, payload: value });
          });
        }, Number('500')),
      );
    },
    [limitKeys, onChange, st],
  );

  return <NumberInput {...others} max={max} min={min} onChange={_onChange} />;
};
