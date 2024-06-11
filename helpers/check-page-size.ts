export const checkPageSize = async (pageSize: string) => {
  if (!pageSize) return;

  if (isNaN(Number(pageSize))) {
    throw new Error("PageSize must be a number");
  }

  if (Number(pageSize) < 1) {
    throw new Error("PageSize must be greater than 1");
  }
};
