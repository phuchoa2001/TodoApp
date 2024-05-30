import { timeAgo } from ".";
import i18next from 'i18next';

/**
 * Calculates the difference between a given date and the current date.
 * @param {Date} date - The target date to calculate the difference from.
 * @param {string} [lang=navigator.language || "en-US"] - The language code used for formatting.
 * @returns {string} A string representing the calculated difference in `Intl` format.
 */
export const calculateDateDifference = (
  date: Date,
  lang: string = navigator.language || "en-US"
): string => {
  const currentDate = new Date();
  const targetDate = new Date(date);
  const difference = targetDate.getTime() - currentDate.getTime();
  const differenceDays = Math.floor(difference / (1000 * 60 * 60 * 24));
  const differenceHours = Math.floor(difference / (1000 * 60 * 60));
  const differenceMinutes = Math.floor(difference / (1000 * 60));
  const userLocale = lang;

  if (targetDate < currentDate) {
    return `${i18next.t('task.notCompletedOnTime')} (${timeAgo(targetDate, userLocale)})`;
  } else if (targetDate.toDateString() === currentDate.toDateString()) {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceHours > 0 ? differenceHours : differenceMinutes,
      differenceHours > 0 ? i18next.t('task.hour') : i18next.t('task.minute')
    );
  } else if (targetDate.getDate() === currentDate.getDate() + 1) {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(1, i18next.t('task.day'));
  } else if (differenceDays <= 7) {
    const dayOfWeek = new Intl.DateTimeFormat(userLocale, { weekday: "long" }).format(date);
    return `${dayOfWeek} (${new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceDays,
      i18next.t('task.day')
    )})`;
  } else {
    return new Intl.RelativeTimeFormat(userLocale, { numeric: "auto" }).format(
      differenceDays,
      i18next.t('task.day')
    );
  }
};
