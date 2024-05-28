import i18next from "i18next";

/**
 * Returns a greeting based on the current time.
 * @returns {string} The appropriate greeting.
 */
export const displayGreeting = (): string => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting: string;

  if (currentHour < 12 && currentHour >= 5) {
    greeting = i18next.t("home.greetings.morning");
  } else if (currentHour < 18 && currentHour >= 12) {
    greeting = i18next.t("home.greetings.afternoon");
  } else {
    greeting = i18next.t("home.greetings.evening");
  }

  return greeting;
};
