import React, { useEffect, useState } from 'react';
import {
  App,
  init,
  verifyRoutes,
  useCore,
} from 'lins-core';
import { useAppData, history } from 'umi';

const config = {{{config}}}
const dicKeys = {{{dictionary}}};

const Children = ({
  noLoginPaths = ['/login'],
  loading,
  children
}) => {
  const [status, setStatus] = useState('init');
  const { refreshMe, getToken, dictionaryRun, getMeData } = useCore();
  const { pathname } = location;
  const token = getToken();

  const handleFetchData = async () => {
    setStatus('loading');

    await refreshMe();
    await dictionaryRun(dicKeys);

    setStatus('pass');
  }

  useEffect(() => {
    const unlisten = history.listen((e) => {
      const token = getToken();

      // 跳转无需登录页面，直接放行
      if (
        verifyRoutes(noLoginPaths, e.location.pathname)
      ) {
        setStatus('pass');
        return;
      }

      // 从登录页面跳转而来，必须获取用户信息
      if (
        pathname === '/login' &&
        !verifyRoutes(noLoginPaths, e.location.pathname)
      ) {
        handleFetchData();
        return;
      }

      // 无需登录的页面 >> 需要登录的页面
      if (
        verifyRoutes(noLoginPaths, pathname) &&
        !verifyRoutes(noLoginPaths, e.location.pathname)
      ) {
        if (meData) {
          setStatus('pass');
          return;
        };

        if (token) {
          handleFetchData();
          return;
        }

        history.push('/login')
      }
    });

    const meData = getMeData();

    if (verifyRoutes(noLoginPaths, pathname) || meData) {
      setStatus('pass');
      return;
    }

    if (!verifyRoutes(noLoginPaths, pathname)) {
      if (token) {
        handleFetchData();
      } else {
        history.push('/login');
      }
    }

    return () => {
      unlisten();
    }
  }, []);

  // 需要登录的页面
  if (status === 'loading' && loading) {
    return loading;
  }

  return (
    <>
      {status === 'pass' && children}
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

  init({ ...config, history: runtimeConfig.history })

  return (
    <App>
      <Children {...runtimeConfig}>
        {props.children}
      </Children>
    </App>
  )
}
