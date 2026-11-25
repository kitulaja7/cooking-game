// Dapur Senja — every tuning number and layout rect in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to
// the window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** One dinner-rush shift, in seconds. */
export const SHIFT_SECONDS = 180;

/** Seconds of play per rush level; order pressure grows each level. */
export const LEVEL_EVERY = 45;

/** Order board tuning. */
export const ORDER = {
  slots: 3,
  baseTime: 48,
  timePerLevel: -4,
  minTime: 26,
  spawnInterval: 7,
  spawnPerLevel: -0.9,
  minSpawn: 3.2,
};

/** Prep tuning: chops per ingredient, seconds to cook in the wok. */
export const PREP = {
  chopClicks: 3,
  cookSeconds: 2.2,
};

/** Seconds lost from the shift clock on a wrong serve. */
export const WRONG_PENALTY_SECONDS = 5;

/** Rupiah lost when an order expires unserved. */
export const EXPIRE_PENALTY = 500;

/** Rupiah bonus per combo step on a serve (combo 2 pays +250, combo 3 pays +500, ...). */
export const COMBO_BONUS = 250;

/** Points per rupiah earned, for the score line. */
export const SCORE_PER_RUPIAH = 1;

/** Layout rects, in logical pixels. The order board is left, the kitchen is
 *  the middle, the serve window is right, the ingredient counter is the
 *  bottom row: every criterion-1 element is on screen at once. */
export const LAYOUT = {
  hud: { x: 0, y: 0, w: 1280, h: 62 },
  board: { x: 10, y: 72, w: 282, h: 392 },
  ticket: { w: 262, h: 110, gap: 8 },
  kitchen: { x: 302, y: 72, w: 596, h: 392 },
  boardStation: { x: 322, y: 94, w: 258, h: 142 },
  wokStation: { x: 620, y: 94, w: 258, h: 142 },
  plateStation: { x: 392, y: 252, w: 416, h: 196 },
  serve: { x: 908, y: 72, w: 362, h: 392 },
  bins: { x: 10, y: 476, w: 1260, h: 234 },
  bin: { w: 200, h: 212, gap: 12 },
};

/** The ticket rect for order slot `i` (0-based). */
export function ticketRect(i) {
  return {
    x: LAYOUT.board.x + 10,
    y: LAYOUT.board.y + 34 + i * (LAYOUT.ticket.h + LAYOUT.ticket.gap),
    w: LAYOUT.ticket.w,
    h: LAYOUT.ticket.h,
  };
}

/** The bin rect for ingredient index `i` (0-based). */
export function binRect(i) {
  return {
    x: LAYOUT.bins.x + 6 + i * (LAYOUT.bin.w + LAYOUT.bin.gap),
    y: LAYOUT.bins.y + 12,
    w: LAYOUT.bin.w,
    h: LAYOUT.bin.h,
  };
}

/** Dusk palette: a warm warung at sunset — deep blue wall, amber lamps,
 *  wood counters, terracotta tiles. */
export const COLORS = {
  wallTop: '#33415e',
  wallBottom: '#20293d',
  lamp: '#ffd98a',
  lampGlow: 'rgba(255, 217, 138, 0.20)',
  woodDark: '#5d3f27',
  wood: '#7d5535',
  woodLight: '#9c7046',
  counterTop: '#c98f5f',
  tile: '#b85c43',
  tileDark: '#9c4632',
  cream: '#f6ead6',
  paper: '#fff6e3',
  paperDark: '#efe0c2',
  ink: '#2a2118',
  inkSoft: '#5b4a35',
  red: '#d94f3d',
  redDark: '#8f2418',
  green: '#4e9b47',
  greenDark: '#2f6b2a',
  amber: '#e8a13a',
  gold: '#f2c14e',
  blue: '#4a7fb5',
  shadow: 'rgba(20, 14, 8, 0.35)',
};
