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
const StickPerson = ({ x, y, delay, activity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const animFrame = frame - delay;
  const bobbing = Math.sin(animFrame / 10) * 3;
  const waving = activity === "wave" ? Math.sin(animFrame / 8) * 20 : 0;
  const swimming = activity === "swim" ? Math.sin(animFrame / 6) * 15 : 0;
  const opacity = interpolate(
    animFrame,
    [0, 20, 500, 520],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return /* @__PURE__ */ jsxDEV("g", { transform: `translate(${x}, ${y + bobbing})`, opacity, children: [
    /* @__PURE__ */ jsxDEV("circle", { cx: "0", cy: "-8", r: "4", fill: "#FFE0BD", stroke: "#000", strokeWidth: "1" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 54,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("line", { x1: "0", y1: "-4", x2: "0", y2: "8", stroke: "#000", strokeWidth: "2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 57,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      "line",
      {
        x1: "0",
        y1: "0",
        x2: -8 + (activity === "wave" ? waving : 0),
        y2: 4 + (activity === "swim" ? swimming : 0),
        stroke: "#000",
        strokeWidth: "2"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 60,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      "line",
      {
        x1: "0",
        y1: "0",
        x2: 8 - (activity === "wave" ? waving : 0),
        y2: 4 - (activity === "swim" ? swimming : 0),
        stroke: "#000",
        strokeWidth: "2"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV("line", { x1: "0", y1: "8", x2: "-5", y2: "16", stroke: "#000", strokeWidth: "2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 78,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV("line", { x1: "0", y1: "8", x2: "5", y2: "16", stroke: "#000", strokeWidth: "2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 79,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 52,
    columnNumber: 5
  });
};
const BeachWaterShader = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const waveOffset = frame * 2;
  const activities = ["wave", "swim", "stand"];
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV(
    "svg",
    {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
      children: [
        /* @__PURE__ */ jsxDEV("defs", { children: [
          /* @__PURE__ */ jsxDEV("linearGradient", { id: "water", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
            /* @__PURE__ */ jsxDEV("stop", { offset: "0%", stopColor: "#1e3a8a" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 102,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("stop", { offset: "50%", stopColor: "#0ea5e9" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 103,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("stop", { offset: "100%", stopColor: "#06b6d4" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 104,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 101,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("linearGradient", { id: "sand", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
            /* @__PURE__ */ jsxDEV("stop", { offset: "0%", stopColor: "#fef3c7" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 108,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV("stop", { offset: "100%", stopColor: "#f59e0b" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 109,
              columnNumber: 13
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 107,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("filter", { id: "waterRipple", children: [
            /* @__PURE__ */ jsxDEV(
              "feTurbulence",
              {
                type: "fractalNoise",
                baseFrequency: "0.02 0.03",
                numOctaves: "3",
                seed: Math.floor(frame / 5),
                result: "turbulence"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 113,
                columnNumber: 13
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "feDisplacementMap",
              {
                in: "SourceGraphic",
                in2: "turbulence",
                scale: "10",
                xChannelSelector: "R",
                yChannelSelector: "G"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 120,
                columnNumber: 13
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 112,
            columnNumber: 11
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 100,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("rect", { x: "0", y: height * 0.7, width, height: height * 0.3, fill: "url(#sand)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 131,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV("rect", { x: "0", y: "0", width, height: height * 0.7, fill: "url(#water)", filter: "url(#waterRipple)" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 134,
          columnNumber: 9
        }),
        [0, 1, 2, 3, 4].map((i) => {
          const y = height * 0.65 + Math.sin((frame + i * 50) / 20) * 10;
          return /* @__PURE__ */ jsxDEV(
            "ellipse",
            {
              cx: width * (0.2 * i),
              cy: y,
              rx: width * 0.15,
              ry: "8",
              fill: "rgba(255, 255, 255, 0.3)",
              opacity: 0.6 + Math.sin((frame + i * 30) / 15) * 0.2
            },
            i,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 140,
              columnNumber: 13
            }
          );
        }),
        /* @__PURE__ */ jsxDEV(StickPerson, { x: width * 0.2, y: height * 0.5, delay: 0, activity: "swim" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 153,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(StickPerson, { x: width * 0.4, y: height * 0.55, delay: 30, activity: "wave" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 154,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(StickPerson, { x: width * 0.65, y: height * 0.45, delay: 60, activity: "swim" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 155,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(StickPerson, { x: width * 0.8, y: height * 0.6, delay: 90, activity: "stand" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 156,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(StickPerson, { x: width * 0.3, y: height * 0.65, delay: 120, activity: "wave" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 157,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(StickPerson, { x: width * 0.55, y: height * 0.52, delay: 150, activity: "swim" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 158,
          columnNumber: 9
        }),
        Array.from({ length: 15 }).map((_, i) => {
          const sparkleX = random(`sparkle-x-${i}`) * width;
          const sparkleY = random(`sparkle-y-${i}`) * height * 0.6;
          const sparkleDelay = random(`sparkle-delay-${i}`) * 100;
          const opacity = Math.max(0, Math.sin((frame - sparkleDelay) / 20));
          return /* @__PURE__ */ jsxDEV(
            "circle",
            {
              cx: sparkleX,
              cy: sparkleY,
              r: "2",
              fill: "white",
              opacity: opacity * 0.8
            },
            i,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 168,
              columnNumber: 13
            }
          );
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 7
    }
  ) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 93,
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
        lineNumber: 201,
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
        lineNumber: 210,
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
            lineNumber: 222,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 215,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 200,
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
      lineNumber: 264,
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
      lineNumber: 300,
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
    /* @__PURE__ */ jsxDEV(BeachWaterShader, {}, void 0, false, {
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
