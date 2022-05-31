import React, { useEffect } from 'react';
import {
  App,
  init,
  verifyRoutes,
  useCore,
  useCoreState,
} from 'lins-core';
import { useAppData, history } from 'umi';

init({{{config}}})

const dictionaryKeys = {{{dictionary}}};

const Children = ({
  noLoginPaths = ['/login'],
  loading,
  children
}) => {
  const { refreshMe, getToken, dictionaryRun } = useCore();
  const running = useCoreState();
  const { pathname } = location;
  const token = getToken();

  useEffect(() => {
    if (!verifyRoutes(noLoginPaths, location.pathname)) {
      if (token) {
        refreshMe();
        dictionaryRun(dictionaryKeys)
      } else {
        history.push('/login');
        location.reload()
      }
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
          dictionaryRun(dictionaryKeys)
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
  if ((!running) && loading) {
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
