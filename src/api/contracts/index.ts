import mock from "./mock.json";

export type ClauseSection = {
  sectionName: string;
  options: string[];
};

export type ClausesDocument = {
  sections: ClauseSection[];
};

// Will be real API call in prod env
export const analyzePDF = async (
  timeout: number = 1000,
): Promise<ClausesDocument> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(mock);
    }, timeout);
  });
};
