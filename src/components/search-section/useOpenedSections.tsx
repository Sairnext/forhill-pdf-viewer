// useOpenedSections.ts
import { useMemo } from "react";

export type OptionWithOpen = { value: string; opened: boolean };
export type SectionWithOpen = {
  sectionName: string;
  opened: boolean;
  options: OptionWithOpen[];
};

export type ClausesDocument = {
  sections: { sectionName: string; options: string[] }[];
};

const normalize = (s: string) => s.trim().toLowerCase();

export const useOpenedSections = (
  data: ClausesDocument | null | undefined,
  filterQuery: string,
): SectionWithOpen[] => {
  return useMemo(() => {
    const sections = data?.sections ?? [];
    const q = normalize(filterQuery);

    if (!q) {
      return sections.map((sec) => ({
        sectionName: sec.sectionName,
        opened: false,
        options: sec.options.map((o) => ({ value: o, opened: false })),
      }));
    }

    return sections.map((sec) => {
      const secMatch = normalize(sec.sectionName).includes(q);
      const options = sec.options.map((o) => ({
        value: o,
        opened: normalize(o).includes(q),
      }));
      const anyOptMatch = options.some((o) => o.opened);
      return {
        sectionName: sec.sectionName,
        opened: secMatch || anyOptMatch,
        options,
      };
    });
  }, [data, filterQuery]);
};
