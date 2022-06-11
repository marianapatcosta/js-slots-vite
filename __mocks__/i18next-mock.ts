const i18n = {
  init: () => {},
  t: (k: string) => k,
  use: () => {
    return i18n;
  },
  useTranslation: () => [(k: string) => k],
};
export default i18n;
