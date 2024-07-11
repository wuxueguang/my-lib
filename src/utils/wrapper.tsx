import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Drawer, ModalProps, DrawerProps } from 'antd';

interface Options {
  autoHide: boolean;
}

function wrap<T>(AnyCanShow: React.FC<T>) {
  const SHOW = 'show';
  const HIDE = 'hide';
  const useModalOrDrawer = (opts: Options = { autoHide: true }): [React.FC<T>, () => void, () => void] => {
    const et = useMemo(() => new EventTarget(), []);
    const show = useCallback(() => et.dispatchEvent(new CustomEvent(SHOW)), [et]);
    const hide = useCallback(() => et.dispatchEvent(new CustomEvent(HIDE)), [et]);

    const WrappeedAnyCanShow = useCallback(
      (props) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [visible, setVisible] = useState<boolean>(false);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [confirmLoading, setConfirming] = useState<boolean>(false);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          const handler0 = () => setVisible(true);
          et.addEventListener(SHOW, handler0);

          const handler1 = () => setVisible(false);
          et.addEventListener(HIDE, handler1);

          return () => {
            et.removeEventListener(SHOW, handler0);
            et.removeEventListener(HIDE, handler1);
          };
        }, []);

        const _props = {
          visible,
          confirmLoading,
          onClose: () => {
            typeof props.onClose === 'function' && props.onClose();
            opts.autoHide && hide();
          },
          onCancel: () => {
            typeof props.onCancel === 'function' && props.onCancel();
            opts.autoHide && hide();
          },
          async onOk() {
            try {
              setConfirming(true);
              const okRet = typeof props.onOk === 'function' && props.onOk();
              if (okRet.then) {
                await okRet;
              }
              opts.autoHide && hide();
            } finally {
              setConfirming(false);
            }
          },
        };

        return <AnyCanShow destroyOnClose {...props} {..._props} />;
      },
      [et, hide, opts.autoHide],
    );

    return [WrappeedAnyCanShow, show, hide];
  };

  return useModalOrDrawer;
}

export const useModal = wrap<ModalProps>(Modal);

export const useDrawer = wrap<DrawerProps>(Drawer);
