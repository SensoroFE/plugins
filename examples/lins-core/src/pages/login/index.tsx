// @ts-ignore
import { history } from '@umijs/max';
import { Login } from 'lins-login';

export default () => {
  const handleSucess = () => {
    history.push('/dashboard');
  };

  return <Login onSuccess={handleSucess} />;
};
