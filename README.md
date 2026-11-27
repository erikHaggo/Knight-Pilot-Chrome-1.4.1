# Knight Pilot — Chrome extension

Knight Pilot is an unofficial, local Chrome extension for Chess.com that uses Stockfish to analyze positions and optionally display move suggestions or submit moves. It runs the engine in the browser and does not require an API key or remote service.

## Setup

1. Extract the downloaded ZIP if you have not already done so.
2. Keep the entire extracted folder together; it includes `manifest.json`, the extension scripts, and the bundled Stockfish files.
3. In Chrome, open `chrome://extensions`.
4. Enable **Developer mode** in the upper-right corner.
5. Click **Load unpacked**.
6. Select this folder (the folder that contains `manifest.json`), not the ZIP file or an individual source file.
7. Pin **Knight Pilot** through Chrome's puzzle-piece Extensions menu.
8. Open `https://www.chess.com/` or `https://chess.com/`.
9. Click the Knight Pilot extension icon and configure the board side, thinking time, and arrow or move settings.

Automatic moves are disabled when a page first loads. Start with move suggestions first, and verify every position against the board.

## Install

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**, then select the folder containing `manifest.json`.
   In the source project this is the `extension` subfolder. If using the ZIP, extract it first and select the extracted folder.
4. Open or reload your Chess.com game page.
5. Open Chrome's puzzle-piece Extensions menu, pin **Knight Pilot**, and click it.
6. Set **I’m playing as → Automatic · bottom color** to follow board orientation. White/Black overrides remain available. Existing installations keep their previous choice until changed.

## Update 1.4.1 — independent opponent-reply analysis

Fixed a missing-arrow case when Stockfish returns only the first move of its principal variation. On your turn, the opponent reply is now searched independently from the position after your suggestion; it no longer depends on an optional second PV move. On the opponent's turn, their direct search uses 0.5 seconds to avoid unnecessarily waiting for your longer thinking-time preference. Orange-only mode works with green suggestions disabled.

The popup now explains when the overlay is hidden, a reply is still being analyzed, or the suggested move ends the game. Capture-excluded mode still never falls back to browser arrows. The 1.4.0 Windows companion remains compatible; replacing files in your existing extension directory preserves its ID and registration.

Validated November 27, 2026: 16 rules/engine/package tests and 33 browser checks passed. A separate signed-out test on Chess.com's real computer-bot page displayed an orange-only e7–e5 reply to the suggested e2–e4 move; no move was submitted. Actual opponent choices remain predictions.

## Update 1.4.0 — opponent predictions and optional Windows capture exclusion

The bottom-corner status card is removed. Use the extension popup for status and Stop, or press Esc.

**Opponent’s next move** replaces the attack-map feature. When the opponent is to move, the orange arrow shows Stockfish's best suggestion for that side. On your turn, it shows the expected engine reply *after your suggested move*, with that condition stated in the popup. These are predictions, not knowledge of what the opponent will actually play. If no legal reply is available in the engine line, no orange arrow is drawn.

**Capture-excluded arrows · Windows** uses the separate Windows companion supplied alongside this extension. Extract the companion folder permanently, run Install.cmd, and paste the extension ID shown under **Companion setup** in the popup. Then enable the capture-excluded setting. It requires Windows 10 version 2004 or newer. The companion uses a click-through native window with `WDA_EXCLUDEFROMCAPTURE`; the extension requests the additional `nativeMessaging` permission. It sends only arrow geometry through a local browser pipe, with no TCP server, screenshot access, or input injection.

While this mode is enabled, browser arrows are always hidden, including if the companion is unavailable. The native window clears on focus loss, bad geometry, or stale updates. Keep the full board visible and close docked developer tools/side panels if geometry cannot be matched. The popup remains capturable. Windows capture affinity and native protocol/render checks passed locally; actual Discord capture and physical multi-monitor/zoom alignment have not been verified. Test your Discord preview before relying on this mode; capture exclusion is best-effort, not a guarantee for every recording method. See the companion README for installation and removal.

Version 1.4.0 passed 13 rules/engine/package tests and 31 browser checks, including conditional opponent replies, opponent-turn predictions, removal of the card, and hidden browser arrows when the native host is missing. Native checks verify the Windows exclusion flag, offscreen arrow drawing, framed messaging, invalid-frame rejection, clear and EOF shutdown.

## Update 1.3.0 — coaching and review

Replace the files in your installed extension folder, reload Knight Pilot in Chrome's extensions page, then reload Chess.com. This update is for the desktop browser extension.

- **Target strength:** Beginner (Stockfish skill 2), Intermediate (8), Advanced (16), or Best (20). These are skill settings, not calibrated Elo ratings. Previous Frequent mistakes and Occasional mistakes choices map to Beginner and Intermediate. Random legal-move replacement has been removed.
- **Blunder limit:** maximum estimated loss of 0.5, 1, or 2 pawns relative to the best evaluated candidate, or Off. The engine examines up to five candidates and compares scores from the same completed search depth. If its weaker selection exceeds the cap, the best candidate is used. A low cap can make Beginner stronger. Short searches can miss tactics; this is not a guarantee against losing a queen.
- **Move explanations:** short descriptions of captures, checks, castling, promotions, development, and central moves. These describe observable move effects, not a full strategic proof.
- **Opponent arrows:** see the 1.4.0 update above; these now predict moves instead of showing attacked pieces.
- **Post-game review:** click **Review a finished game**, paste a PGN or import a `.pgn` file, then click **Review game**. The local engine estimates loss per move and displays alternatives and explanations. Reviews support up to 500 half-moves, include progress/cancellation, save the latest report locally, and export JSON. PGN import is required; the extension does not retrieve game archives. Individual position searches do not reconstruct prior repetitions. Ratings and accuracy percentages are not inferred.
- **Saved preferences:** strength, blunder limit, side, thinking time, explanations, threats, and hidden-overlay preference are stored locally. The dropdown polling reset fix is retained. Automatic play starts off on new pages. Stop explicitly disables suggestions and threat arrows.
- **Quick hide:** press **Alt+Shift+H** while focused on the chess page, outside text inputs, to hide/restore page overlays. Esc stops suggestions, threat arrows, and automatic moves.
- **Connection indicator:** version, board connection, detected side, and the last engine status are shown in the popup. Working status is reported after a real engine response; idle does not claim the engine has been tested.

Hide overlays removes arrows for everyone, including you. This hide switch is separate from the optional Windows capture-excluded mode. The extension popup can itself be captured. No anti-ban or anti-timeout guarantee is provided.

## Settings

- **Show best move:** Stockfish's suggested move is drawn as a green arrow when it is your selected color's turn. The popup also shows notation, search depth, and the evaluation from White's perspective.
- **Automatic moves:** submits that move through the board's move interface. You can enable it independently of the arrow.
- **Thinking time:** 0.5, 1.5, 3, or 5 seconds per move. Longer searches generally provide stronger suggestions. Engine startup adds some overhead.
- **Stop all / Esc:** disable both modes immediately. An already-submitted move cannot be undone by stopping.

Automatic moves start OFF on every full page load and stop on a URL change, game end, or error. They pause while the tab is hidden. Preferences are remembered; automatic play is not. Settings apply to the tab you control. Select your color again before enabling auto for a different game. Automatic play does not start matches, accept challenges, or click promotion dialogs: promotions are passed to the board's move interface.

## Limitations

Chess.com prohibits engine assistance against human opponents and may close accounts for it. Its Fair Play Policy excludes computer/bot games. See https://support.chess.com/en/articles/8568369-what-do-i-need-to-know-about-fair-play-on-chess-com . Use bot games to check functionality.

This is an unofficial extension. It depends on the site's undocumented `wc-chess-board` / `chess-board` `game.getFEN()` and `game.move()` interfaces. Changes to those interfaces can break compatibility. Unsupported boards display an error instead of inventing a position. A move that does not change the board within 2.5 seconds stops auto. Board changes cannot prove server acceptance; confirm moves in your game. No extension can guarantee winning every game.

Only standard chess is supported. Chess960 and other variants are not supported. The position comes from the current board, so this engine does not receive full move history and cannot reliably account for earlier repetitions. Castling and en passant use the complete FEN supplied by the board.

The engine is **Stockfish 19 Lite, single-threaded**, a smaller and weaker build than full Stockfish. All engine computation happens locally. There is no server, API key, telemetry, account access, remote script loading, anti-detection feature, or network interception. Requested site access is limited to `chess.com` and `www.chess.com` over HTTPS. `scripting` reads/submits board moves, `storage` saves preferences, and `offscreen` hosts the engine worker.

## Build and test

Node.js required for development only. The provided `extension` folder is ready to load.

```text
npm ci --ignore-scripts
npm run build
npm test
npm run test:browser
```

Browser tests use Playwright's Chromium. Install it with `npx playwright install chromium` if missing. Tests exercise the packaged engine, chess rules, stale-position rejection, popup settings, arrow placement, and auto movement against a local simulated Chess.com board. They do not certify live-site compatibility or enter a human match.

Validated on November 27, 2026: 13 rules/engine/package tests and 27 browser checks passed for version 1.3.0. These include engine skill output, candidate loss limits, threats, hiding, preferences, PGN review, persistence, and cancellation. Older live-site testing: A separate signed-out check on the actual Chess.com computer-bot page successfully displayed an e4 suggestion and submitted e2–e4 automatically. Human-opponent modes have not been tested. The live check is optional: `node tests/live-check.mjs` reads compatibility information; `node tests/live-check.mjs --bot-move` starts a guest bot game, checks one suggestion and automatic move, then closes the test browser.

## Third-party licenses and sources

- Stockfish.js 19.0.1, Nathan Rugg and contributors: GPL-3.0, copied unmodified from the npm `stockfish@19.0.1` package. License: `vendor/STOCKFISH-LICENSE.txt` inside the extension. Source and build instructions: https://github.com/nmrugg/stockfish.js/tree/v19.0.1 . Upstream: https://github.com/official-stockfish/Stockfish . The matching source must accompany any redistribution as required by GPLv3; this development package includes license and source references, not an independent source offer.
- chess.js 1.4.0, Jeff Hlywa and contributors: BSD-2-Clause. License: `vendor/CHESS-JS-LICENSE.txt`. Source: https://github.com/jhlywa/chess.js/tree/v1.4.0 .

This extension is not affiliated with Chess.com or the Stockfish project.
