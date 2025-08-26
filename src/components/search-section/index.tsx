import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useState,
  useMemo,
  type SetStateAction,
  type Dispatch,
  useEffect,
} from "react";

import { Flex } from "@common/styled";
import { appendActiveElement } from "@common/utils/common.ts";

import { usePromiseOrNull } from "@common/hooks/usePromiseOrNull.tsx";
import { Collapsable } from "@common/components/Collapsable.tsx";
import { Bullet } from "@common/components/Bullet.tsx";

import { useOpenedSections } from "./useOpenedSections.tsx";

import { analyzePDF, type ClausesDocument } from "../../api/contracts";

import {
  SearchInput,
  SearchInputWrapper,
  Wrapper,
  StyledSearch,
} from "./styled.tsx";

interface Props {
  setQuery: Dispatch<SetStateAction<string | string[]>>;
}

export const SearchSection: React.FC<Props> = ({ setQuery }) => {
  const [searchValue, setSearch] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.currentTarget.value);
  };

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();

      setFilterQuery(searchValue);
    }
  };

  const infoPromise = useMemo(() => analyzePDF(), []); // add deps (e.g., [file]) if needed
  const data = usePromiseOrNull<ClausesDocument>(infoPromise);

  const openedSections = useOpenedSections(data, filterQuery);

  useEffect(() => {
    const searchFor = openedSections.reduce<string[]>((acc, next) => {
      const activeOptions = next.options.filter((el) => el.opened);

      return acc.concat(activeOptions.map((el) => el.value));
    }, []);

    setQuery(searchFor);
  }, [openedSections]);

  const onBulletClick = (label: string, active: boolean) => {
    setQuery((previous) => {
      if (typeof previous === "string") {
        return previous;
      } else {
        return appendActiveElement(previous, label, active);
      }
    });
  };

  return (
    <Wrapper>
      <SearchInputWrapper>
        <SearchInput
          placeholder="Search for Contract Clause"
          value={searchValue}
          onChange={onSearch}
          onKeyDown={onKeyDown}
        />
        <StyledSearch />
      </SearchInputWrapper>
      {data && data.sections && (
        <Flex direction="column">
          {openedSections &&
            openedSections.map((sec) => (
              <Collapsable
                key={`${sec.sectionName}`}
                label={sec.sectionName}
                isOpened={sec.opened}
              >
                {sec.options.map((el) => {
                  return (
                    <Bullet
                      key={`${el.value}`}
                      label={el.value}
                      active={el.opened}
                      onClick={onBulletClick}
                    />
                  );
                })}
              </Collapsable>
            ))}
        </Flex>
      )}
    </Wrapper>
  );
};
