export function calculateWillpowerScore(stringArray: string[]) {
  const totalEntries = stringArray.length;
  const totalLength = stringArray.join("").length;
  return Math.floor((totalEntries * 5 + totalLength) / 10);
}
