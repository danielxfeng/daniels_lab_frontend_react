/**
 * @summary A function to add an id to a set.
 */
const insertToSet = (id: string, set: Set<string>): boolean => {
  if (set.has(id)) return false;
  set.add(id);
  return true;
};

export default insertToSet;
