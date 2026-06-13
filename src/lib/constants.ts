export const FREE_TEST_IDS = ["mock-1", "mock-2"];

export const APP_NAME = "satzone.";

export function isFreeTest(testId: string): boolean {
  return FREE_TEST_IDS.includes(testId);
}
