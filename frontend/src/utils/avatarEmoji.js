/**
 * Persistent Emoji Avatar System
 *
 * Assigns a deterministic emoji avatar to each user based on their stable
 * unique identifier (_id). The same user always receives the same emoji,
 * regardless of page refreshes, re-logins, or different browsers.
 *
 * Uses a simple hash of the user ID to index into a fixed emoji pool.
 * No randomness at render time — the mapping is purely deterministic.
 */

// Fixed, stable emoji pool — DO NOT reorder or remove entries,
// as that would change existing users' assigned emojis.
const AVATAR_EMOJIS = [
  '🐶', // 0
  '🐱', // 1
  '🦊', // 2
  '🐼', // 3
  '🐸', // 4
  '🐵', // 5
  '🦁', // 6
  '🐯', // 7
  '🐨', // 8
  '🐰', // 9
  '🐻', // 10
  '🐹', // 11
  '🐷', // 12
  '🐙', // 13
  '🦄', // 14
  '🤖', // 15
  '👽', // 16
  '👻', // 17
  '🥷', // 18
  '🤠', // 19
];

/**
 * Compute a simple numeric hash from a string.
 * Uses a basic djb2-style hash to convert any string (like a MongoDB ObjectId)
 * into a stable integer, which is then used to index into the emoji pool.
 *
 * @param {string} str - The input string to hash
 * @returns {number} A non-negative integer hash value
 */
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // hash * 33 + charCode
    hash = (hash * 33 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Get the deterministic emoji avatar for a given user ID.
 *
 * @param {string} userId - The user's stable unique identifier (e.g. MongoDB _id)
 * @returns {string} A single emoji character that is permanently associated with this user
 */
export function getAvatarEmoji(userId) {
  if (!userId || typeof userId !== 'string') {
    // Safe fallback for missing/invalid user IDs
    return '🐾';
  }
  const index = simpleHash(userId) % AVATAR_EMOJIS.length;
  return AVATAR_EMOJIS[index];
}

export { AVATAR_EMOJIS };
