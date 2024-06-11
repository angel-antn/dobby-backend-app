export const checkPage = async (page: string) => {
  if (!page) return;

  if (isNaN(Number(page))) {
    throw new Error("Page must be a number");
  }

  if (Number(page) < 1) {
    throw new Error("Page must be greater than 1");
  }
};
