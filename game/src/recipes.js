// Dapur Senja — ingredients and recipes. All names, dishes and prices are
// original: a Jakarta warung at dusk, not a copy of any commercial game.
// Each ingredient knows what it needs before it can go on a plate:
//   none — straight from the bin to the plate
//   chop — must be chopped on the talenan first (3 clicks)
//   cook — must spend time in the wok first
//   chop+cook — chopped, then cooked (the slow, valuable one: chicken)

export const INGREDIENTS = [
  { id: 'nasi',   name: 'NASI',   key: '1', need: 'none',      color: '#f7f3e8', dark: '#d8cdb4' },
  { id: 'ayam',   name: 'AYAM',   key: '2', need: 'chop+cook', color: '#e8a25e', dark: '#a85f2a' },
  { id: 'mie',    name: 'MIE',    key: '3', need: 'cook',      color: '#f2c14e', dark: '#c08a1e' },
  { id: 'sayur',  name: 'SAYUR',  key: '4', need: 'chop',      color: '#6fbf4a', dark: '#3d7a28' },
  { id: 'telur',  name: 'TELUR',  key: '5', need: 'none',      color: '#fff3c4', dark: '#d9b64a' },
  { id: 'sambal', name: 'SAMBAL', key: '6', need: 'none',      color: '#d94f3d', dark: '#8f2418' },
];

export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

/** How an ingredient's stage is shown on the plate and in the hand. */
export const STAGE_LABEL = { raw: '', chopped: 'cincang', cooked: 'matang' };

/** Six dishes. `ings` lists the ingredient ids a plate must hold (each in
 *  its finished stage) to match the recipe. Prices in rupiah. */
export const RECIPES = [
  { id: 'nasi-goreng', name: 'NASI GORENG', ings: ['nasi', 'telur', 'ayam', 'sambal'], price: 22000, color: '#e8a13a' },
  { id: 'mie-ayam',    name: 'MIE AYAM',    ings: ['mie', 'ayam', 'sayur'],           price: 18000, color: '#f2c14e' },
  { id: 'soto-ayam',   name: 'SOTO AYAM',   ings: ['ayam', 'sayur', 'telur'],         price: 20000, color: '#f7d774' },
  { id: 'gado-gado',   name: 'GADO-GADO',   ings: ['sayur', 'telur', 'sambal'],       price: 16000, color: '#6fbf4a' },
  { id: 'ayam-geprek', name: 'AYAM GEPREK', ings: ['ayam', 'sambal', 'nasi'],         price: 24000, color: '#d94f3d' },
  { id: 'nasi-ayam',   name: 'NASI AYAM',   ings: ['nasi', 'ayam', 'sayur'],          price: 19000, color: '#e8a25e' },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

/** The recipe a plate holding `ingIds` matches, or null. Order of ids does not matter. */
export function matchRecipe(ingIds) {
  const have = [...ingIds].sort().join(',');
  for (const recipe of RECIPES) {
    if ([...recipe.ings].sort().join(',') === have) return recipe;
  }
  return null;
}

/** Rupiah formatted the Indonesian way: 22000 -> "Rp 22.000". */
export function rupiah(n) {
  return 'Rp ' + String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
