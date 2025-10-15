import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { MusicVideo } from "./composition.jsx";
createRoot(document.getElementById("app")).render(
  /* @__PURE__ */ jsxDEV(
    Player,
    {
      component: MusicVideo,
      durationInFrames: 3600,
      fps: 30,
      compositionWidth: 540,
      compositionHeight: 960,
      loop: true,
      controls: true,
      style: { width: "100%", height: "100%" }
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 7,
      columnNumber: 3
    }
  )
);
