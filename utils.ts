export const checkXIndent = (size: number) => {
  if (size < 639) return -15;
  else if (size > 639 && size < 768) return -23;
  else if (size < 1120 && size >= 767) return -24;
  else return 0;
};
