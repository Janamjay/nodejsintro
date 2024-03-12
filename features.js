const gfName = "MrsRandom";
const gfName1 = "MrsRandom1";
const gfName2 = "MrsRandom2";
export { gfName, gfName1, gfName2 };
// // module.exports = gfName;

export const generateLovePercent = () => {
  return `${Math.floor(Math.random() * 100)}%`;
};
