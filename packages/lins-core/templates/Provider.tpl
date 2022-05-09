import React from 'react';
import {
  init,
  verifyRoutes,
  useGlobalService,
  useCoreState,
  GlobalService,
} from 'lins-core';
import { useAppData } from 'umi';

init({{{config}}})

const Children: React.FC = ({
  noLoginPaths = [],
  loading,
  children
}) => {
  const running = useCoreState();
  const { pathname } = location;

  // 无需登录页面直接放行
  if (verifyRoutes(noLoginPaths, pathname)) {
    return children;
  }

  // 需要登录的页面
  if (!running && loading) {
    return loading;
  }

  return (
    <>
      {running && children}
    </>
  )
}

export default (props) => {
  const { pluginManager } = useAppData();
  const globalService = useGlobalService();

  const runtimeConfig = pluginManager.applyPlugins({
    key: 'linsCore',
    type: 'modify',
    initialValue: {
      noLoginPaths: [
        '/login',
        '/exception/:path?'
      ]
    },
  });

  return (
    <GlobalService.Provider value={globalService}>
      <Children {...runtimeConfig}>
        {props.children}
      </Children>
    </GlobalService.Provider>
  )
}
