// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

// i18n
//   // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
//   // learn more: https://github.com/i18next/i18next-http-backend
//   // .use(Backend)
//   // detect user language
//   // learn more: https://github.com/i18next/i18next-browser-languageDetector
//   // .use(LanguageDetector)
//   // pass the i18n instance to react-i18next.
//   .use(initReactI18next)
//   // init i18next
//   // for all options read: https://www.i18next.com/overview/configuration-options
//   .init({
//     fallbackLng: 'en',
//     debug: true,

//     interpolation: {
//       escapeValue: false, // not needed for react as it escapes by default
//     }
//   });

// export default i18n;


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import en from './en.json';
import ja from './ja.json';
// const en = require('./en.json');
// const ja = require('./ja.json');

i18n.use(initReactI18next).init({
  lng: getLocales()[0].languageCode,
  fallbackLng: 'en',
  // ns: ['common'],
  // defaultNS: 'common',
  resources: { en, ja },
  // resources: {
  //     en: {
  //       translation: {
  //         'UserName': 'UserName',
  //         'Login': 'Login',
  //       },
  //     },
  //     ja: {
  //       translation: {
  //         'UserName': 'ユーザー名',
  //         'Login': 'ログイン',
  //       },
  //     },
  // },
  interpolation: { escapeValue: false }, // not needed for react
  // react: { wait: true }
});
export default i18n;

// @flow
// import ReactNativeLanguages from 'react-native-languages';
// import i18n from 'i18next';

// import en from './en.json';
// import ja from './ja.json';

// export default i18n.init({
//   debug: __DEV__,
//   lng: ReactNativeLanguages.language,
//   fallbackLng: 'en',
//   ns: ['common'],
//   defaultNS: 'common',
//   //resources: { en, fr, de, th, ja},
//   resources: { en, ja },
//   interpolation: { escapeValue: false }, // not needed for react
//   react: { wait: true }
// });
