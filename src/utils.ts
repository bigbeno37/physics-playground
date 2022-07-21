/**
 * Adds the given value to the associated set from the given key if it exists, or a new set.
 *
 * @param key The key to add the value to.
 * @param value The value to add.
 * @param map The map to add the value to.
 */
export const mapAddToSet = <K, V>(key: K, value: V, map: Map<K, Set<V>>) => {
	const existing = map.get(key) ?? new Set<V>();
	existing.add(value);
	map.set(key, existing);
};

/**
 * Removes the given value from the associated set from the given key if it exists.
 *
 * @param key The key to remove the value from.
 * @param value The value to remove.
 * @param map The map to remove the value from.
 */
export const mapDeleteFromSet = <K, V>(key: K, value: V, map: Map<K, Set<V>>) => {
	const existing = map.get(key) ?? new Set<V>();
	existing.delete(value);
	map.set(key, existing);
};