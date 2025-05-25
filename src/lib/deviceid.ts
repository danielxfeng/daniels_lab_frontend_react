let deviceIdCache: string | null = null;

/**
 * A function to get the device ID using FingerprintJS.
 * It caches the device ID so it requests only once for each session.
 * @returns A promise that resolves to the device ID.
 */
const getDeviceId = async (): Promise<string> => {
  if (deviceIdCache) return deviceIdCache;

  // Laze load for performance
  const fp = await import('@fingerprintjs/fingerprintjs');
  const instance = await fp.load();
  const result = await instance.get();

  // To exclude some components from the fingerprinting process
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { plugins, audio, ...components } = result.components;
  if ('value' in components.canvas) {
    components.canvas.value.text = '';
  }

  const visitorId = fp.hashComponents(components);

  deviceIdCache = visitorId;
  return visitorId;
};

export default getDeviceId;
