import API from './apiService';

// export const telegramLogin = (initDataRaw: string) => {
//   return API.post('/auth/telegram', {
//     headers: {
//       Authorization: `tma ${initDataRaw}`,
//     },
//   });
// };

// import API from './apiService';

export const telegramLogin = (initDataRaw: string) => {
  return API.post('/auth/telegram', { initDataRaw });
};
