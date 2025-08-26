export const appendActiveElement = (
  array: string[],
  str: string,
  active: boolean,
) => {
  if (!active) {
    return array.filter((el) => el !== str);
  } else {
    const findIndex = array.findIndex((el) => el === str);

    return findIndex === -1 ? [...array, str] : array;
  }
};
