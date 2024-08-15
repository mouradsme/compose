import Toast from '@/components/common/messages/notifications';
import { ReactElement, createContext, useContext, useState } from 'react';

export type MessageType = 'info' | 'warning' | 'error' | 'success';

export interface MessageState {
  message: string | undefined;
  type: MessageType | undefined;
  showMessage: (msg: string, type: MessageType) => void;
  clearMessage: () => void;
}

const defaultState: MessageState = {
  message: undefined,
  type: undefined,
  showMessage: () => {
    throw Error('Method not implemented');
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clearMessage: () => {
    throw Error('Method not implemented');
  },
};

const MessageContext = createContext<MessageState>(defaultState);

export const useMessage = () => {
  return useContext(MessageContext);
};

interface MessageProviderProps {
  children: ReactElement;
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [type, setType] = useState<MessageType | undefined>(undefined);

  const showMessage = (msg: string, msgType: MessageType) => {
    setMessage(msg);
    setType(msgType);
  };

  const clearMessage = () => {
    setMessage(undefined);
    setType(undefined);
  };

  return (
    <MessageContext.Provider value={{ message, type, showMessage, clearMessage }}>
      <Toast message={message} type={type} clearMessage={clearMessage} />
      {children}
    </MessageContext.Provider>
  );
};
