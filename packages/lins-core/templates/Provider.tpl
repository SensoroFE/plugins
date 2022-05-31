import React, { useEffect } from 'react';
import {
  App,
  init,
  verifyRoutes,
  usePassport,
  useCoreState,
  useRequestDictionary,
} from 'lins-core';
import { useAppData, history } from 'umi';

init({{{config}}})

const Children: React.FC = ({
  noLoginPaths = [],
  loading,
  children
}) => {
  const { refreshMe, getToken, } = usePassport();
  const running = useCoreState();
  const dictionaryRunning = useRequestDictionary();
  const { pathname } = location;

  useEffect(() => {
    if (!verifyRoutes(noLoginPaths, location.pathname)) {
      refreshMe();
    }

    const unlisten = history.listen(({ location }) => {
      const token = getToken();
      // 无需登录的页面 >> 需要登录的页面
      if (
        verifyRoutes(noLoginPaths, pathname) &&
        !verifyRoutes(noLoginPaths, location.pathname)
      ) {
        if (token) {
          refreshMe();
          return;
        }

        history.push('/login')
      }
    });

    return () => {
      unlisten();
    }
  }, [])

  // 无需登录页面直接放行
  if (verifyRoutes(noLoginPaths, pathname)) {
    return children;
  }

  // 需要登录的页面
  if ((!running || !dictionaryRunning) && loading) {
    return loading;
  }

  return (
    <>
      {running && dictionaryRunning && children}
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
