/**
 * @summary URLSearchParams parser
 * @description
 * To write this function to parse the URLSearchParams object into an object.
 * To support the array values like ?tag=tag1&tag=tag2.
 * @param searchParams - The URLSearchParams object containing the search parameters.
 * @returns The object containing the parsed search parameters.
 */
const urlParamSafeParser = (searchParams: URLSearchParams): Record<string, string | string[]> => {
  const result: Record<string, string | string[]> = {};

  for (const [k, v] of searchParams.entries()) {
    if (!result[k]) result[k] = v;
    else if (Array.isArray(result[k])) result[k].push(v);
    else result[k] = [result[k], v];
  }

  return result;
};

export default urlParamSafeParser;
