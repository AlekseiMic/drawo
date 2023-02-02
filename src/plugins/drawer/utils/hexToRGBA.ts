export const hexToRGBA = (color: string) => {
  const num = Number('0x' + color.slice(1, 9));
  return {
    r: (num >> 24) & 255,
    g: (num >> 16) & 255,
    b: (num >> 8) & 255,
    a: num & 255,
  };
};
