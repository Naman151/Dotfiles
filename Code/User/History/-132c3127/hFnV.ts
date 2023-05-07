import apisauce from 'apisauce';

const baseUrl = 'https://api.com';
const create = (baseURL = baseUrl) => {
  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
    },
    timeout: 100000,
  });
  const formDataHeaderConfig = {
    // headers: {Authorization: `Bearer ${accessToken}`},
  };
  const signIn = (data: any) => api.post('/auth/warehouse-login', data);
  const signUp = (data: any) => api.post('/auth/register-as-warehouse', data);

  return {
    signIn,
    signUp,
  };
};

export default {
  create,
};
