import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  random,
  Img
} from "remotion";
import {
  TransitionSeries,
  linearTiming
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
const TypedText = ({ text, startFrame, speed = 2 }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(Math.max(0, frame - startFrame) / speed);
  const displayText = text.substring(0, charsToShow);
  const showCursor = Math.floor((frame - startFrame) / 15) % 2 === 0;
  return /* @__PURE__ */ jsxDEV("span", { children: [
    displayText,
    charsToShow < text.length && showCursor && /* @__PURE__ */ jsxDEV("span", { style: { opacity: 1 }, children: "|" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 29,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 26,
    columnNumber: 5
  });
};
const BeachSimulationBackground = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = React.useRef(null);
  const simRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!simRef.current) {
      const cellSize2 = 5;
      const gridWidth2 = Math.floor(width / cellSize2);
      const gridHeight2 = Math.floor(height / cellSize2);
      const grid2 = Array(gridWidth2).fill(null).map(() => Array(gridHeight2).fill(0));
      const beachLevel = Math.floor(gridHeight2 * 0.7);
      for (let x = 0; x < gridWidth2; x++) {
        const sandHeight = beachLevel - Math.floor(random(`sand-h-${x}`) * 5);
        for (let y = sandHeight; y < gridHeight2; y++) {
          grid2[x][y] = 1;
        }
      }
      simRef.current = { grid: grid2, gridWidth: gridWidth2, gridHeight: gridHeight2, cellSize: cellSize2 };
    }
    const { grid, gridWidth, gridHeight, cellSize } = simRef.current;
    const ctx = canvas.getContext("2d");
    const nextGrid = grid.map((col) => [...col]);
    const waveFrequency = 0.03;
    const waveHeight = 0.1 * gridHeight;
    const waveOffset = 0.05 * gridHeight;
    const waveTop = Math.floor(
      gridHeight * 0.4 + Math.sin(frame * waveFrequency) * waveHeight + waveOffset
    );
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < waveTop; y++) {
        if (nextGrid[x][y] === 0) {
          nextGrid[x][y] = 2;
        }
      }
      for (let y = waveTop; y < gridHeight; y++) {
        if (nextGrid[x][y] === 2) {
          nextGrid[x][y] = 0;
        }
      }
    }
    for (let y = gridHeight - 2; y >= 0; y--) {
      for (let x = 0; x < gridWidth; x++) {
        const current = grid[x][y];
        if (current === 0) continue;
        const below = grid[x][y + 1];
        if (current === 1) {
          if (below === 0 || below === 2) {
            nextGrid[x][y] = below;
            nextGrid[x][y + 1] = 1;
          } else {
            const dir = random(`dir-${x}-${y}-${frame}`) > 0.5 ? 1 : -1;
            const ax = x + dir;
            const ay = y + 1;
            if (ax >= 0 && ax < gridWidth && (grid[ax][ay] === 0 || grid[ax][ay] === 2)) {
              nextGrid[x][y] = grid[ax][ay];
              nextGrid[ax][ay] = 1;
            } else {
              const bx = x - dir;
              const by = y + 1;
              if (bx >= 0 && bx < gridWidth && (grid[bx][by] === 0 || grid[bx][by] === 2)) {
                nextGrid[x][y] = grid[bx][by];
                nextGrid[bx][by] = 1;
              }
            }
          }
        } else if (current === 2) {
          if (below === 0) {
            nextGrid[x][y] = 0;
            nextGrid[x][y + 1] = 2;
          } else {
            const dir = random(`dir-water-${x}-${y}-${frame}`) > 0.5 ? 1 : -1;
            const ax = x + dir;
            if (ax >= 0 && ax < gridWidth && grid[ax][y] === 0) {
              nextGrid[x][y] = 0;
              nextGrid[ax][y] = 2;
            } else {
              const bx = x - dir;
              if (bx >= 0 && bx < gridWidth && grid[bx][y] === 0) {
                nextGrid[x][y] = 0;
                nextGrid[bx][y] = 2;
              }
            }
          }
        }
      }
    }
    simRef.current.grid = nextGrid;
    ctx.fillStyle = "rgb(10, 20, 40)";
    ctx.fillRect(0, 0, width, height);
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        const type = nextGrid[x][y];
        if (type === 0) continue;
        const px = x * cellSize;
        const py = y * cellSize;
        if (type === 1) {
          ctx.fillStyle = "#c2b280";
          ctx.fillRect(px, py, cellSize, cellSize);
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.fillRect(px, py, cellSize, 1);
          ctx.fillRect(px, py, 1, cellSize);
          ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
          ctx.fillRect(px, py + cellSize - 1, cellSize, 1);
          ctx.fillRect(px + cellSize - 1, py, 1, cellSize);
        } else if (type === 2) {
          const aboveIsWater = y > 0 && nextGrid[x][y - 1] === 2;
          ctx.fillStyle = aboveIsWater ? "rgba(100, 150, 255, 0.8)" : "rgba(255, 255, 255, 0.5)";
          ctx.fillRect(px, py, cellSize, cellSize);
        }
      }
    }
  }, [frame, width, height]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV("canvas", { ref: canvasRef, width, height }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 179,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 178,
    columnNumber: 5
  });
};
const ImageSlide = ({ word, imageSrc }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const imageZoom = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 90
  });
  const textOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: [
    /* @__PURE__ */ jsxDEV(
      Img,
      {
        src: imageSrc,
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1 + imageZoom * 0.1})`
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 202,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)"
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 211,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          opacity: textOpacity
        },
        children: /* @__PURE__ */ jsxDEV(
          "h2",
          {
            style: {
              color: "white",
              fontSize: "4.5rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              textShadow: "0 0 20px black",
              letterSpacing: "0.2em",
              textAlign: "center"
            },
            children: word
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 223,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 216,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 201,
    columnNumber: 5
  });
};
const FloatingWord = ({ word, delay, duration, position }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 },
    durationInFrames: duration
  });
  const opacity = interpolate(
    frame,
    [delay, delay + 20, delay + duration - 20, delay + duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(progress, [0, 1], [height * 0.6, position.y]);
  const x = interpolate(progress, [0, 1], [width / 2, position.x]);
  const rotation = interpolate(progress, [0, 1], [0, position.rotation]);
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#fff",
        opacity,
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
        textShadow: "0 0 20px rgba(255,255,255,0.5)"
      },
      children: word
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 265,
      columnNumber: 5
    }
  );
};
const KeyboardKey = ({ char, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 }
  });
  const opacity = interpolate(
    frame,
    [delay, delay + 10, delay + 40, delay + 50],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        padding: "1rem 1.2rem",
        background: "rgba(255,255,255,0.1)",
        border: "2px solid rgba(255,255,255,0.3)",
        borderRadius: "8px",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#fff",
        transform: `scale(${scale})`,
        opacity,
        boxShadow: "0 4px 20px rgba(255,255,255,0.2)"
      },
      children: char
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 301,
      columnNumber: 5
    }
  );
};
const MusicVideo = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const bgColor = "rgb(10, 10, 30)";
  const words = [
    { word: "IMAGINE", src: "/imagine.png" },
    { word: "CREATE", src: "/create.png" },
    { word: "BUILD", src: "/build.png" },
    { word: "DESIGN", src: "/design.png" },
    { word: "CODE", src: "/code.png" },
    { word: "DREAM", src: "/dream.png" },
    { word: "VISUALIZE", src: "/visualize.png" },
    { word: "INNOVATE", src: "/innovate.png" }
  ];
  const positions = React.useMemo(() => words.map((word, i) => {
    const angle = random(`angle-${i}`) * Math.PI * 2;
    const radius = width * 0.4 + random(`radius-${i}`) * 100;
    return {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      rotation: random(`rotation-${i}`) * 60 - 30
    };
  }), [width, height]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: bgColor }, children: [
    /* @__PURE__ */ jsxDEV(Audio, { src: "/WebSim Bounce - Type What You Want - Sonauto(1).ogg" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 350,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(BeachSimulationBackground, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 351,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 0, durationInFrames: 180, children: /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3.5rem",
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          padding: "2rem"
        },
        children: /* @__PURE__ */ jsxDEV(TypedText, { text: "JUST TYPE", startFrame: 30, speed: 3 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 366,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 355,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 354,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 180, durationInFrames: 180, children: /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          padding: "2rem"
        },
        children: /* @__PURE__ */ jsxDEV(TypedText, { text: "WHAT YOU WANT", startFrame: 0, speed: 3 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 382,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 371,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 370,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 360, durationInFrames: 900, children: /* @__PURE__ */ jsxDEV(TransitionSeries, { children: words.map((item, i) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(ImageSlide, { word: item.word, imageSrc: item.src }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 392,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 391,
        columnNumber: 15
      }),
      i < words.length - 1 && /* @__PURE__ */ jsxDEV(
        TransitionSeries.Transition,
        {
          timing: linearTiming({ durationInFrames: 30 }),
          presentation: fade()
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 395,
          columnNumber: 17
        }
      )
    ] }, i, true, {
      fileName: "<stdin>",
      lineNumber: 390,
      columnNumber: 13
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 388,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 387,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 360, durationInFrames: 900, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: words.map((item, i) => /* @__PURE__ */ jsxDEV(
      FloatingWord,
      {
        word: item.word,
        delay: i * 120 + random(`delay-${i}`) * 30,
        duration: 300,
        position: positions[i]
      },
      i,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 409,
        columnNumber: 13
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 407,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 406,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 1260, durationInFrames: 600, children: /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "2rem"
        },
        children: ["W", "E", "B", "S", "I", "M"].map((char, i) => /* @__PURE__ */ jsxDEV(KeyboardKey, { char, delay: i * 15 }, i, false, {
          fileName: "<stdin>",
          lineNumber: 432,
          columnNumber: 13
        }))
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 422,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 421,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 1860, durationInFrames: 600, children: /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          padding: "3rem",
          lineHeight: 1.4
        },
        children: /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("div", { style: { marginBottom: "2rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "AI UNDERSTANDS", startFrame: 0, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 453,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 452,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem", opacity: 0.8 }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "YOUR VISION", startFrame: 100, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 456,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 455,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 451,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 439,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 438,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 2460, durationInFrames: 540, children: /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          padding: "2rem",
          flexDirection: "column",
          gap: "3rem"
        },
        children: [
          /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(TypedText, { text: "NO LIMITS", startFrame: 0, speed: 3 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 478,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 477,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "NO BOUNDARIES", startFrame: 60, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 481,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 480,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2.5rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "JUST TYPE", startFrame: 140, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 484,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 483,
            columnNumber: 11
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 464,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 463,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 3e3, durationInFrames: 600, children: /* @__PURE__ */ jsxDEV(
      AbsoluteFill,
      {
        style: {
          justifyContent: "center",
          alignItems: "center",
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          padding: "2rem"
        },
        children: /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              opacity: interpolate(
                frame - 3e3,
                [0, 30, 570, 600],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            },
            children: "WEBSIM"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 502,
            columnNumber: 11
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 491,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 490,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 349,
    columnNumber: 5
  });
};
export {
  MusicVideo
};
