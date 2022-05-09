import { history } from '@umijs/max';
import { Login } from 'lins-login';

export default () => {
  const handleSucess = () => {
    history.push('/');
  };

  return <Login onSuccess={handleSucess} />;
};
