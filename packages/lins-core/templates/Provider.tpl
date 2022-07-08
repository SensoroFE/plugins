import { useEffect } from 'react';
import {
  App,
  init,
  verifyRoutes,
  useCore,
} from 'lins-core';
import { useAppData } from 'umi';

const config = {{{config}}}
const dicKeys = {{{dictionary}}};

const Children = ({
  noLoginPaths = ['/login'],
  loading,
  children
}) => {
  const { meLoading, fetchDictionary, getDictionaryState, token } = useCore();
  const { pathname } = location;

  useEffect(() => {
    const dictionaryState = getDictionaryState(dicKeys).filter(item => !item);

    if (token && dictionaryState.length) {
      fetchDictionary(dicKeys);
    }
  }, [token])

  // 需要登录的页面
  if (meLoading && loading && verifyRoutes(noLoginPaths, pathname)) {
    return loading;
  }

  return (
    <>
      {children}
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
