// File: utils/getLanguageFromLocalStorage.ts

/**
 * Function to retrieve the language value from localStorage or navigator.language
 * @returns {string} The language value from localStorage, navigator.language, or the default value 'en'
 */
export const getLanguageFromLocalStorage = (): string => {
  const storedLanguage = localStorage.getItem('user');

  if (storedLanguage) {
    const storageUser = JSON.parse(storedLanguage);
    const lang = storageUser.settings[0].languages;
    return lang;
  }

  // If no value is found in localStorage, try to get the language from navigator.language
  const navigatorLanguage = navigator.language;
  if (navigatorLanguage) {
    return navigatorLanguage;
  }

  // If no value is found in localStorage or navigator.language, return the default value 'en'
  return 'en';
};
