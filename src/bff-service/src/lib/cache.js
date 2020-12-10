const DEFAULT_CACHE_TIME = 2 * 60 * 1000;

class MemoryCache {
	constructor(cacheTime = DEFAULT_CACHE_TIME) {
		this.cacheTime = cacheTime;
		this.cache = new Map();
	}

	putValue(key, value, time) {
		const cacheTime = time || this.cacheTime;
    const isAlreadyCached = this.cache.has(key);

		if (isAlreadyCached) {
			console.log('Value with such key already cached');
			return;
    }

    this.cache.set(key, value);

		setTimeout(() => {
			this.cache.delete(key);
		}, cacheTime);
  }

  getValue(key) {
    const value = this.cache.get(key);

    return value ? value : null;
  }
}

export default MemoryCache;
