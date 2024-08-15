import { getUserInfoClient } from '@/lib/common';
import axios from 'axios';
import useSWR from 'swr';

interface FetcherProps {
  url?: string;
  params?: any;
  headers?: any;
  token?: string;
}

interface RequestProps {
  data?: any;
  error?: any;
  isLoading: boolean;
  isError: boolean;
  mutate?: any;
}

// Our fetcher function
const fetcher = ({ url, params, headers, token }: FetcherProps) => {
  if (!url) {
    return;
  }

  return axios
    .get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    })
    .then((res) => res.data);
};

// Our custom hook
const useRequest = (props: FetcherProps): RequestProps => {
  const _props = props;
  _props.token = getUserInfoClient().accessToken;
  const { data, error, ...rest } = useSWR(_props, fetcher);
  return {
    data,
    isError: !!error,
    error,
    ...rest,
  };
};

export default useRequest;
