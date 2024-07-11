import React, { useState, useEffect, useCallback } from 'react';
import { InputNumber, InputNumberProps } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';

type MaybeNumber = valueType | null | undefined;

export interface NumberInputProps extends Omit<InputNumberProps, 'onChange' | 'max' | 'min'> {
  max?: number;
  min?: number;
  initialValue?: MaybeNumber;
  onChange?(value: number | null): void;
}

export const MAX_NUMBER = 9999999.999;

export const NumberInput = (props: NumberInputProps) => {
  const { max = MAX_NUMBER, min = -MAX_NUMBER, initialValue, onChange, ...others } = props;

  const [onInputSt, setOnInputSt] = useState<any>();
  const [onChangeSt, setOnChangeSt] = useState<any>();
  const [_max, setMax] = useState<number>();
  const [_min, setMin] = useState<number>();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (typeof initialValue === 'string') {
      setValue(initialValue);
    }
    if (typeof initialValue === 'number') {
      setValue(String(initialValue));
    }
  }, [initialValue]);

  useEffect(() => {
    let newValue = value;

    if (Number.isFinite(max) && max !== _max) {
      newValue = Number(value) > max ? String(max) : value;
      setMax(max);
    }
    if (Number.isFinite(min) && min !== _min) {
      newValue = Number(value) < min ? String(min) : value;
      setMin(min);
    }
    if (newValue !== value) {
      setValue(newValue);
      onChange && onChange(Number(newValue));
    }
  }, [max, _max, min, _min, value, onChange]);

  const _onChange = useCallback(
    (_value: valueType) => {
      setValue(_value !== null ? String(_value) : '');
      clearTimeout(onChangeSt);
      setOnChangeSt(
        setTimeout(() => {
          onChange && onChange(_value !== null ? Number(_value) : null);
        }, Number('500')),
      );
    },
    [onChange, onChangeSt],
  );

  const onInput = useCallback(
    async (value) => {
      setValue(value);
      if (value.length > 0) {
        const _value = Number(value);
        if (isNaN(_value) || (Number.isFinite(max) && _value > max) || (Number.isFinite(min) && _value < min)) {
          clearTimeout(onChangeSt);
        }

        const validValue = await new Promise<number | null>((resolve) => {
          clearTimeout(onInputSt);
          setOnInputSt(
            setTimeout(() => {
              if (isNaN(_value)) {
                resolve(null);
              } else if (Number.isFinite(max) && _value > max) {
                resolve(max);
              } else if (Number.isFinite(min) && _value < min) {
                resolve(min);
              }
            }, Number('500')),
          );
        });
        onChange && onChange(validValue);
        setValue(typeof validValue === 'number' ? String(validValue) : '');
      }
    },
    [max, min, onChange, onChangeSt, onInputSt],
  );

  return <InputNumber {...others} value={value ?? undefined} onInput={onInput} onChange={_onChange} max={max} min={min} />;
};
