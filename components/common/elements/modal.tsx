import { cloneElement } from 'react';

interface ModalInterface {
  children: JSX.Element;
}

const Modal = ({ children }: ModalInterface) => {
  const styledChild = cloneElement(children, {
    style: {
      overflow: 'auto',
      maxHeight: '80vh',
      ...children.props.style,
    },
  });
  return (
    <div className="fixed  inset-0 flex items-center justify-center z-[80]">{styledChild}</div>
  );
};

export default Modal;
