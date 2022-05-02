import React from 'react';
import { init, GlobalService, useGlobalService } from 'lins-core';

init({{{config}}})

export default (props) => {
  const globalService = useGlobalService();

  return (
    <GlobalService.Provider value={globalService}>
      {props.children}
    </GlobalService.Provider>
  )
}
