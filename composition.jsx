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
const SandfallBackground = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = React.useRef(null);
  const particlesRef = React.useRef(null);
  const numParticles = 5e3;
  const noiseScale = 5e-3;
  const particleSpeed = 1.5;
  const getNoise = (x, y) => {
    const angleX = Math.sin(x * noiseScale * 0.7 + frame * 0.01) * Math.PI;
    const angleY = Math.sin(y * noiseScale + frame * 5e-3) * Math.PI;
    return (angleX + angleY) * 0.5;
  };
  React.useEffect(() => {
    if (!particlesRef.current) {
      particlesRef.current = Array.from({ length: numParticles }, (_, i) => ({
        x: random(`p-x-${i}`) * width,
        y: random(`p-y-${i}`) * height,
        color: `hsl(45, 30%, ${60 + random(`p-l-${i}`) * 20}%)`
      }));
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(10, 10, 30, 0.15)";
    ctx.fillRect(0, 0, width, height);
    const particles = particlesRef.current;
    particles.forEach((p) => {
      const angle = getNoise(p.x, p.y);
      p.x += Math.cos(angle) * particleSpeed + (random(`p-rand-x-${p.x}`) - 0.5) * 0.5;
      p.y += Math.sin(angle) * particleSpeed + 1;
      if (p.y > height) {
        p.y = 0;
        p.x = random(`p-x-reset-${p.y}`) * width;
      }
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 1, 1);
    });
  }, [frame, width, height]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV("canvas", { ref: canvasRef, width, height }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 89,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 88,
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
        lineNumber: 112,
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
        lineNumber: 121,
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
            lineNumber: 133,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 126,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 111,
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
      lineNumber: 175,
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
      lineNumber: 211,
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
      lineNumber: 260,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(SandfallBackground, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 261,
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
          lineNumber: 276,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 265,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 264,
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
          lineNumber: 292,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 281,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 280,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 360, durationInFrames: 900, children: /* @__PURE__ */ jsxDEV(TransitionSeries, { children: words.map((item, i) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(ImageSlide, { word: item.word, imageSrc: item.src }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 302,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 301,
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
          lineNumber: 305,
          columnNumber: 17
        }
      )
    ] }, i, true, {
      fileName: "<stdin>",
      lineNumber: 300,
      columnNumber: 13
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 298,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 297,
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
        lineNumber: 319,
        columnNumber: 13
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 317,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 316,
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
          lineNumber: 342,
          columnNumber: 13
        }))
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 332,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 331,
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
            lineNumber: 363,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 362,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem", opacity: 0.8 }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "YOUR VISION", startFrame: 100, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 366,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 365,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 361,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 349,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 348,
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
            lineNumber: 388,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 387,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "NO BOUNDARIES", startFrame: 60, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 391,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 390,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2.5rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "JUST TYPE", startFrame: 140, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 394,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 393,
            columnNumber: 11
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 374,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 373,
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
            lineNumber: 412,
            columnNumber: 11
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 401,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 400,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 259,
    columnNumber: 5
  });
};
export {
  MusicVideo
};
