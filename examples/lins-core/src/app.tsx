import { Spin } from 'antd';

export const linsCore = ({}) => {
  return {
    noLoginPaths: [
      '/login',
      '/exception/:path?'
    ],
    loading: <Spin />
  }
}
