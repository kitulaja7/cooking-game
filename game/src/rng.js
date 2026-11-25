// Dapur Senja — a tiny seeded RNG (mulberry32). Every random choice in the
// game comes from here, so the same seed always deals the same shift: the
// screenshot scenes are reproducible frames of a real game.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] from a random function. */
export function intBetween(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Pick one element of `arr` from a random function. */
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/** Fisher-Yates shuffle of a copy, from a random function. */
export function shuffled(rng, arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
