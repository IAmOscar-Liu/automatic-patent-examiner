export const parseTipoCookie = (str) => {
  if (!str) return {};
  try {
    return str
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
  } catch (e) {
    return {};
  }
};
