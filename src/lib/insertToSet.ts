/**
 * @summary A function to add an id to a set.
 * @description
 * This function checks if the id is already in the set. If it is, it does not add it again.
 * If it is not, it adds the id to the set and returns true.
 * @param id the id to be added to the set
 * @param set the set to be added to
 * @returns if the id was added to the set
 */
const insertToSet = (id: string, set: Set<string>): boolean => {
  if (set.has(id)) return false;
  set.add(id);
  return true;
};

export default insertToSet;
