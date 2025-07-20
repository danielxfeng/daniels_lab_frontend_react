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
