import i18next from "i18next";

/**
 * Returns a task completion message based on the completion percentage.
 * @param {number} completionPercentage - The completion percentage of tasks.
 * @returns {string} A task completion message.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  switch (true) {
    case completionPercentage === 0:
      return i18next.t("home.tasks.completionMessages.0");
    case completionPercentage === 100:
      return i18next.t("home.tasks.completionMessages.100");
    case completionPercentage >= 75:
      return i18next.t("home.tasks.completionMessages.75");
    case completionPercentage >= 50:
      return i18next.t("home.tasks.completionMessages.50");
    case completionPercentage >= 25:
      return i18next.t("home.tasks.completionMessages.25");
    default:
      return i18next.t("home.tasks.completionMessages.default");
  }
};
