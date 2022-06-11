/* const reactI18Next: any = {
  useTranslation: () => [(k: string) => k],
};
 
export default reactI18Next;*/
const reactI18Next: any = jest.createMockFromModule('react-i18next');

reactI18Next.useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  };
};

export default reactI18Next;
