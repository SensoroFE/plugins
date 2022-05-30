import React from 'react';
import {
  App,
  init,
  verifyRoutes,
  useCoreState,
  useRequestDictionary,
} from 'lins-core';
import { useAppData } from 'umi';

init({{{config}}})

const Children: React.FC = ({
  noLoginPaths = [],
  loading,
  children
}) => {
  const running = useCoreState();
  const running1 = useRequestDictionary();
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
      {running && running1 && children}
    </>
  )
}

export default (props) => {
  const { pluginManager } = useAppData();

  const runtimeConfig = pluginManager.applyPlugins({
    key: 'linsCore',
    type: 'modify',
    initialValue: {},
  });

  return (
    <App>
      <Children {...runtimeConfig}>
        {props.children}
      </Children>
    </App>
  )
}
