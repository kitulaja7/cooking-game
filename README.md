# Dapur Senja — Warung Rush

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/kitulaja7/cooking-game/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/kitulaja7/cooking-game/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A cooking game for make.fun's **best-cooking-game-20261125-0137**: one cook,
one warung at dusk, one 180-second dinner rush. See the bounty:
https://make.fun/bounty/best-cooking-game-20261125-0137

## How to play

Take orders from the board, pick ingredients from the counter (click or keys
1–6), prep them — chop on the **talenan** [C], cook in the **wajan** [K] —
assemble the dish on the **piring** [P], and serve it to the matching order
[S] before its timer runs out. Fast serves build a combo; a wrong serve costs
5 seconds; an expired order costs Rp 500.

Six original recipes: Nasi Goreng, Mie Ayam, Soto Ayam, Gado-Gado, Ayam
Geprek, Nasi Ayam. Rush level rises every 45 seconds: orders come faster and
their timers get shorter.

## Run it

```sh
node serve.ts        # then open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored make.fun
library. Screenshots are deterministic scenes staged by `game/src/shots.js`
(`?shot=cover|play|serve|rush`).

## Screenshots

Four frames, each a real render of the game's own code in a desktop browser:

1. **1-cover.jpg** — mid-rush: 3 orders, a finished Nasi Goreng ready to
   serve, mie in the wok, sayur on the talenan, big shift timer, combo x3.
2. **2-play.jpg** — assembling: plate 2/4, ayam cooking, sambal in hand.
3. **3-serve.jpg** — serving Ayam Geprek, combo x4, serve-window flash.
4. **4-rush.jpg** — late rush: 3 red timers, 00:30 left, both stations busy.
