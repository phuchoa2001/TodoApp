import i18next from 'i18next';

/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message with optional emoji code.
 */
export const getRandomGreeting = (): string => {
  const hoursLeft = 24 - new Date().getHours();
  const day = new Date().toLocaleDateString(i18next.language, { weekday: 'long' });
  const month = new Date().toLocaleDateString(i18next.language, { month: 'long' });

  const greetingsText: string[] = i18next.t('home.greetings.random', {
    returnObjects: true,
    day,
    month,
    hoursLeft: hoursLeft > 4 ? `${hoursLeft} hours left in the day. Use them wisely!` : `Only ${hoursLeft} hours left in the day`
  });

  const randomIndex = Math.floor(Math.random() * greetingsText.length);
  return greetingsText[randomIndex];
};
