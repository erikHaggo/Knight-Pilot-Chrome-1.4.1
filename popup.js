(() => {
  // node_modules/chess.js/dist/esm/chess.js
  function peg$subclass(child, parent) {
    function C() {
      this.constructor = child;
    }
    C.prototype = parent.prototype;
    child.prototype = new C();
  }
  function peg$SyntaxError(message, expected, found, location) {
    var self = Error.call(this, message);
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(self, peg$SyntaxError.prototype);
    }
    self.expected = expected;
    self.found = found;
    self.location = location;
    self.name = "SyntaxError";
    return self;
  }
  peg$subclass(peg$SyntaxError, Error);
  function peg$padEnd(str, targetLength, padString) {
    padString = padString || " ";
    if (str.length > targetLength) {
      return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
  }
  peg$SyntaxError.prototype.format = function(sources) {
    var str = "Error: " + this.message;
    if (this.location) {
      var src = null;
      var k;
      for (k = 0; k < sources.length; k++) {
        if (sources[k].source === this.location.source) {
          src = sources[k].text.split(/\r\n|\n|\r/g);
          break;
        }
      }
      var s = this.location.start;
      var offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
      var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
      if (src) {
        var e = this.location.end;
        var filler = peg$padEnd("", offset_s.line.toString().length, " ");
        var line = src[s.line - 1];
        var last = s.line === e.line ? e.column : line.length + 1;
        var hatLen = last - s.column || 1;
        str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, " ") + peg$padEnd("", hatLen, "^");
      } else {
        str += "\n at " + loc;
      }
    }
    return str;
  };
  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
      literal: function(expectation) {
        return '"' + literalEscape(expectation.text) + '"';
      },
      class: function(expectation) {
        var escapedParts = expectation.parts.map(function(part) {
          return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
        });
        return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
      },
      any: function() {
        return "any character";
      },
      end: function() {
        return "end of input";
      },
      other: function(expectation) {
        return expectation.description;
      }
    };
    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }
    function literalEscape(s) {
      return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
        return "\\x0" + hex(ch);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
        return "\\x" + hex(ch);
      });
    }
    function classEscape(s) {
      return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
        return "\\x0" + hex(ch);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
        return "\\x" + hex(ch);
      });
    }
    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }
    function describeExpected(expected2) {
      var descriptions = expected2.map(describeExpectation);
      var i, j;
      descriptions.sort();
      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }
      switch (descriptions.length) {
        case 1:
          return descriptions[0];
        case 2:
          return descriptions[0] + " or " + descriptions[1];
        default:
          return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
      }
    }
    function describeFound(found2) {
      return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
    }
    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };
  var MASK64 = 0xffffffffffffffffn;
  function rotl(x, k) {
    return (x << k | x >> 64n - k) & 0xffffffffffffffffn;
  }
  function wrappingMul(x, y) {
    return x * y & MASK64;
  }
  function xoroshiro128(state) {
    return function() {
      let s0 = BigInt(state & MASK64);
      let s1 = BigInt(state >> 64n & MASK64);
      const result = wrappingMul(rotl(wrappingMul(s0, 5n), 7n), 9n);
      s1 ^= s0;
      s0 = (rotl(s0, 24n) ^ s1 ^ s1 << 16n) & MASK64;
      s1 = rotl(s1, 37n);
      state = s1 << 64n | s0;
      return result;
    };
  }
  var rand = xoroshiro128(0xa187eb39cdcaed8f31c4b365b102e01en);
  var PIECE_KEYS = Array.from({ length: 2 }, () => Array.from({ length: 6 }, () => Array.from({ length: 128 }, () => rand())));
  var EP_KEYS = Array.from({ length: 8 }, () => rand());
  var CASTLING_KEYS = Array.from({ length: 16 }, () => rand());
  var SIDE_KEY = rand();
  var QUEEN = "q";
  var KING = "k";
  var BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64,
    NULL_MOVE: 128
  };
  var SEVEN_TAG_ROSTER = {
    Event: "?",
    Site: "?",
    Date: "????.??.??",
    Round: "?",
    White: "?",
    Black: "?",
    Result: "*"
  };
  var SUPLEMENTAL_TAGS = {
    WhiteTitle: null,
    BlackTitle: null,
    WhiteElo: null,
    BlackElo: null,
    WhiteUSCF: null,
    BlackUSCF: null,
    WhiteNA: null,
    BlackNA: null,
    WhiteType: null,
    BlackType: null,
    EventDate: null,
    EventSponsor: null,
    Section: null,
    Stage: null,
    Board: null,
    Opening: null,
    Variation: null,
    SubVariation: null,
    ECO: null,
    NIC: null,
    Time: null,
    UTCTime: null,
    UTCDate: null,
    TimeControl: null,
    SetUp: null,
    FEN: null,
    Termination: null,
    Annotator: null,
    Mode: null,
    PlyCount: null
  };
  var HEADER_TEMPLATE = {
    ...SEVEN_TAG_ROSTER,
    ...SUPLEMENTAL_TAGS
  };
  var Ox88 = {
    a8: 0,
    b8: 1,
    c8: 2,
    d8: 3,
    e8: 4,
    f8: 5,
    g8: 6,
    h8: 7,
    a7: 16,
    b7: 17,
    c7: 18,
    d7: 19,
    e7: 20,
    f7: 21,
    g7: 22,
    h7: 23,
    a6: 32,
    b6: 33,
    c6: 34,
    d6: 35,
    e6: 36,
    f6: 37,
    g6: 38,
    h6: 39,
    a5: 48,
    b5: 49,
    c5: 50,
    d5: 51,
    e5: 52,
    f5: 53,
    g5: 54,
    h5: 55,
    a4: 64,
    b4: 65,
    c4: 66,
    d4: 67,
    e4: 68,
    f4: 69,
    g4: 70,
    h4: 71,
    a3: 80,
    b3: 81,
    c3: 82,
    d3: 83,
    e3: 84,
    f3: 85,
    g3: 86,
    h3: 87,
    a2: 96,
    b2: 97,
    c2: 98,
    d2: 99,
    e2: 100,
    f2: 101,
    g2: 102,
    h2: 103,
    a1: 112,
    b1: 113,
    c1: 114,
    d1: 115,
    e1: 116,
    f1: 117,
    g1: 118,
    h1: 119
  };
  var SIDES = {
    [KING]: BITS.KSIDE_CASTLE,
    [QUEEN]: BITS.QSIDE_CASTLE
  };
  var ROOKS = {
    w: [
      { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
      { square: Ox88.h1, flag: BITS.KSIDE_CASTLE }
    ],
    b: [
      { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
      { square: Ox88.h8, flag: BITS.KSIDE_CASTLE }
    ]
  };

  // src/common.js
  var DEFAULTS = Object.freeze({ hints: false, color: "auto", thinkMs: 1500, strength: "mixed", hideOverlay: false, blunderLimit: 100, explanations: true, threats: false, captureSafe: false });
  function cleanSettings(input = {}) {
    return {
      hints: input.hints === true,
      color: ["w", "b"].includes(input.color) ? input.color : "auto",
      strength: ["best", "advanced", "mixed", "casual"].includes(input.strength) ? input.strength : "mixed",
      hideOverlay: input.hideOverlay === true,
      blunderLimit: [0, 50, 100, 200].includes(Number(input.blunderLimit)) ? Number(input.blunderLimit) : 100,
      explanations: input.explanations !== false,
      threats: input.threats === true,
      captureSafe: input.captureSafe === true,
      thinkMs: [500, 1500, 3e3, 5e3].includes(Number(input.thinkMs)) ? Number(input.thinkMs) : 1500
    };
  }

  // src/popup.js
  var $ = (id) => document.getElementById(id);
  var controls = ["hints", "auto", "color", "thinkMs", "strength", "hideOverlay", "blunderLimit", "explanations", "threats", "captureSafe"];
  var tabId;
  var saving = false;
  var editRevision = 0;
  var connected = false;
  async function send(type, payload = {}) {
    return chrome.tabs.sendMessage(tabId, { target: "content", type, ...payload });
  }
  function draw(state, updateControls = true) {
    if (updateControls) {
      $("blunderLimit").value = String(state.settings.blunderLimit);
      $("explanations").checked = state.settings.explanations;
      $("captureSafe").checked = state.settings.captureSafe;
      $("threats").checked = state.settings.threats;
      $("hints").checked = state.settings.hints;
      $("auto").checked = state.auto;
      $("color").value = state.settings.color;
      $("strength").value = state.settings.strength;
      $("hideOverlay").checked = state.settings.hideOverlay;
      $("thinkMs").value = String(state.settings.thinkMs);
    }
    if (!updateControls && !saving) for (const id of ["hints", "auto", "hideOverlay", "explanations", "threats", "captureSafe"]) {
      if (document.activeElement !== $(id)) $(id).checked = id === "auto" ? state.auto : state.settings[id];
    }
    $("mode").textContent = state.error ? "NEEDS ATTENTION" : state.thinking ? "THINKING" : state.auto ? "AUTOMATIC" : state.settings.threats ? "OPPONENT PREDICTION" : state.settings.hints ? "SUGGESTIONS" : "READY";
    $("move").textContent = state.move?.san || (state.thinking ? "Thinking\u2026" : "Your move.");
    $("status").textContent = state.error || state.status;
    $("detail").textContent = state.move ? `${state.move.uci} \xB7 Depth ${state.move.depth} \xB7 ${state.move.score} for White` : "";
    $("explanation").textContent = state.settings.explanations ? (state.move?.explanation || "") + (state.move?.limited ? " Blunder limit selected a stronger move." : "") : "";
    $("threat-summary").textContent = state.settings.threats ? state.predictionStatus || "Waiting for an opponent prediction." : "";
    $("capture-status").textContent = state.settings.captureSafe ? state.captureStatus || "Windows companion not connected" : "";
    $("extension-id").textContent = chrome.runtime.id;
    $("health").textContent = `v${state.version || chrome.runtime.getManifest().version} \xB7 ${state.connected ? "Board connected" : "Waiting for board"} \xB7 Side: ${state.detectedColor === "w" ? "White" : state.detectedColor === "b" ? "Black" : "\u2014"}
Engine: ${state.engineState || "Idle"}${state.settings.hideOverlay ? "\nOverlays hidden" : ""}`;
    $("dot").style.background = state.error ? "#ff9a85" : state.auto ? "#b7ff73" : "#bba5ff";
  }
  async function refresh() {
    if (!connected || saving) return;
    const revision = editRevision;
    try {
      const state = await send("STATUS");
      if (revision === editRevision && !saving) draw(state, false);
    } catch {
      disconnect();
    }
  }
  function disconnect() {
    connected = false;
    for (const id of controls) $(id).disabled = true;
    $("stop").disabled = true;
    $("status").textContent = "No connected Chess.com board.";
    $("connection").textContent = "Open Chess.com in this tab, then reload the page after installing the extension.";
  }
  async function save() {
    if (!connected) return;
    saving = true;
    editRevision++;
    try {
      const settings = cleanSettings({ hints: $("hints").checked, color: $("color").value, thinkMs: Number($("thinkMs").value), strength: $("strength").value, hideOverlay: $("hideOverlay").checked, blunderLimit: Number($("blunderLimit").value), explanations: $("explanations").checked, threats: $("threats").checked, captureSafe: $("captureSafe").checked });
      draw(await send("SETTINGS", { settings, auto: $("auto").checked }), false);
    } catch {
      disconnect();
    } finally {
      saving = false;
    }
  }
  for (const id of controls) $(id).addEventListener("change", save);
  $("stop").addEventListener("click", async () => {
    editRevision++;
    try {
      draw(await send("STOP"));
    } catch {
      disconnect();
    }
  });
  $("review").addEventListener("click", () => chrome.tabs.create({ url: chrome.runtime.getURL("review.html") }));
  async function init() {
    const settings = cleanSettings((await chrome.storage.local.get("settings")).settings || DEFAULTS);
    draw({ settings, auto: false, status: "Connecting to your board\u2026" });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab?.id;
    try {
      const state = await send("STATUS");
      connected = true;
      draw(state);
      setInterval(refresh, 500);
    } catch {
      disconnect();
    }
  }
  init();
})();
/*! Bundled license information:

chess.js/dist/esm/chess.js:
  (**
   * @license
   * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   *    this list of conditions and the following disclaimer.
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   *    this list of conditions and the following disclaimer in the documentation
   *    and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)
*/
