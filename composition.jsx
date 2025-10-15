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
const StickPerson = ({ x, y, delay, scale = 1, activitySeed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const animFrame = Math.max(0, frame - delay);
  const activitySwitch = Math.floor(animFrame / (fps * 3) + random(activitySeed));
  const activities = ["idle", "wave", "jump", "walk"];
  const activity = activities[activitySwitch % activities.length];
  const bobbing = Math.sin(animFrame / 10 + random(activitySeed * 2)) * 2;
  let currentY = y + bobbing;
  let leg1Angle = 20;
  let leg2Angle = -20;
  let arm1Angle = 20;
  let arm2Angle = -20;
  let headY = -8;
  if (activity === "wave") {
    arm1Angle = -90 + Math.sin(animFrame / 8) * 45;
    arm2Angle = 20;
  } else if (activity === "jump") {
    const jumpProgress = (animFrame / 20 + random(activitySeed * 3)) % 1;
    const jump = Math.sin(jumpProgress * Math.PI * 2);
    currentY -= Math.max(0, jump) * 15;
    leg1Angle = interpolate(jump, [-1, 1], [0, 45]);
    leg2Angle = interpolate(jump, [-1, 1], [0, -45]);
  } else if (activity === "idle") {
    leg1Angle = 10 + Math.sin(animFrame / 20 + random(activitySeed * 4)) * 5;
    leg2Angle = -10 + Math.sin(animFrame / 20 + random(activitySeed * 4)) * 5;
    arm1Angle = 15 + Math.sin(animFrame / 15 + random(activitySeed * 5)) * 10;
    arm2Angle = -15 + Math.sin(animFrame / 15 + random(activitySeed * 5)) * 10;
  } else if (activity === "walk") {
    const walkCycle = Math.sin(animFrame / 10 + random(activitySeed * 6));
    leg1Angle = walkCycle * 25;
    leg2Angle = -walkCycle * 25;
    arm1Angle = -walkCycle * 20;
    arm2Angle = walkCycle * 20;
    headY += Math.abs(walkCycle) * -2;
  }
  const opacity = interpolate(
    frame,
    [delay, delay + 20, delay + 580, delay + 600],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return /* @__PURE__ */ jsxDEV("g", { transform: `translate(${x}, ${currentY}) scale(${scale})`, opacity, children: /* @__PURE__ */ jsxDEV("g", { stroke: "#000", strokeWidth: 2 / scale, fill: "none", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsxDEV("circle", { cx: "0", cy: headY, r: "4", fill: "#FFE0BD", stroke: "#000", strokeWidth: 1 / scale }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 89,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("line", { y1: -4, y2: 8 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 91,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("line", { y1: "8", x2: Math.sin(leg1Angle * Math.PI / 180) * 8, y2: 8 + Math.cos(leg1Angle * Math.PI / 180) * 8 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 93,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("line", { y1: "8", x2: Math.sin(leg2Angle * Math.PI / 180) * 8, y2: 8 + Math.cos(leg2Angle * Math.PI / 180) * 8 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("line", { y1: "0", x2: Math.sin(arm1Angle * Math.PI / 180) * -7, y2: Math.cos(arm1Angle * Math.PI / 180) * 7 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 96,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("line", { y1: "0", x2: Math.sin(arm2Angle * Math.PI / 180) * 7, y2: Math.cos(arm2Angle * Math.PI / 180) * 7 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 97,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 87,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 86,
    columnNumber: 5
  });
};
const BeachWaterShader = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sandParticles = 5e3;
    const sand = Array.from({ length: sandParticles }, (_, i) => ({
      x: random(`sand-x-${i}`) * width,
      y: height * 0.65 + random(`sand-y-${i}`) * height * 0.35,
      // Darker sand for wet effect
      color: `hsl(40, 50%, ${70 + random(`sand-l-${i}`) * 10}%)`
    }));
    const waveHeight = 20;
    const waveSpeed = 0.02;
    const shorelineY = height * 0.7;
    ctx.clearRect(0, 0, width, height);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, shorelineY);
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(1, "#0ea5e9");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, shorelineY);
    sand.forEach((p) => {
      const waveOffset = Math.sin(p.x / 50 + frame * waveSpeed) * waveHeight;
      const waveY = shorelineY + waveOffset;
      let finalY = p.y;
      let finalColor = p.color;
      if (finalY < waveY + 5) {
        finalY += (waveY - finalY) * 0.1 * random(`sand-disp-${p.x}-${p.y}`);
        finalColor = `hsl(40, 40%, ${40 + random(`sand-wet-l-${p.x}-${p.y}`) * 10}%)`;
      }
      ctx.fillStyle = finalColor;
      ctx.fillRect(p.x, finalY, 2, 2);
    });
    for (let i = 0; i < 15; i++) {
      const y = shorelineY + Math.sin(i * 0.5 + frame * waveSpeed * 2) * (waveHeight * 0.5);
      const grad = ctx.createLinearGradient(0, y - 40, 0, y + 20);
      grad.addColorStop(0, "rgba(14, 165, 233, 0)");
      grad.addColorStop(0.5, "rgba(56, 189, 248, 0.4)");
      grad.addColorStop(1, "rgba(14, 165, 233, 0.7)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, y);
      for (let x = 0; x < width; x += 10) {
        ctx.lineTo(x, y + Math.sin(x / 50 + frame * waveSpeed + i * 0.2) * waveHeight * 0.8);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }
    for (let i = 0; i < 5; i++) {
      const foamY = shorelineY + Math.sin(i * 2 + frame * waveSpeed * 1.5) * waveHeight * 0.9;
      const foamOpacity = 0.5 + Math.sin(frame * 0.1 + i) * 0.3;
      ctx.fillStyle = `rgba(255, 255, 255, ${foamOpacity})`;
      for (let j = 0; j < 30; j++) {
        const foamX = (random(`foam-x-${i}-${j}`) * 1.2 - 0.1) * width;
        const foamSize = random(`foam-size-${i}-${j}`) * 20 + 5;
        if (Math.abs(foamY - (shorelineY + Math.sin(foamX / 50 + frame * waveSpeed) * waveHeight)) < 20) {
          ctx.beginPath();
          ctx.ellipse(foamX, foamY + random(`foam-y-${i}-${j}`) * 10 - 5, foamSize, foamSize / 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [frame, width, height]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: [
    /* @__PURE__ */ jsxDEV("canvas", { ref: canvasRef, width, height }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 192,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: Array.from({ length: 12 }).map((_, i) => {
      const personY = height * 0.8 + random(`person-y-${i}`) * height * 0.15;
      const perspectiveScale = interpolate(personY, [height * 0.75, height * 0.95], [0.7, 1.2]);
      return /* @__PURE__ */ jsxDEV(
        StickPerson,
        {
          x: random(`person-x-${i}`) * width,
          y: personY,
          delay: random(`person-delay-${i}`) * 150,
          scale: perspectiveScale,
          activitySeed: i
        },
        i,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 199,
          columnNumber: 13
        }
      );
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 193,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: Array.from({ length: 25 }).map((_, i) => {
      const sparkleX = random(`sparkle-x-${i}`) * width;
      const sparkleY = random(`sparkle-y-${i}`) * height * 0.7;
      const sparkleDelay = random(`sparkle-delay-${i}`) * 100;
      const opacity = Math.max(0, Math.sin((frame - sparkleDelay) / 20));
      return /* @__PURE__ */ jsxDEV(
        "div",
        {
          style: {
            position: "absolute",
            left: sparkleX,
            top: sparkleY,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "white",
            opacity: opacity * 0.9,
            boxShadow: "0 0 5px white"
          }
        },
        i,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 219,
          columnNumber: 13
        }
      );
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 210,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 191,
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
        lineNumber: 258,
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
        lineNumber: 267,
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
            lineNumber: 279,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 272,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 257,
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
      lineNumber: 321,
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
      lineNumber: 357,
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
      lineNumber: 407,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(BeachWaterShader, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 408,
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
          lineNumber: 423,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 412,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 411,
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
          lineNumber: 439,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 428,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 427,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 360, durationInFrames: 900, children: /* @__PURE__ */ jsxDEV(TransitionSeries, { children: words.map((item, i) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(ImageSlide, { word: item.word, imageSrc: item.src }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 449,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 448,
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
          lineNumber: 452,
          columnNumber: 17
        }
      )
    ] }, i, true, {
      fileName: "<stdin>",
      lineNumber: 447,
      columnNumber: 13
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 445,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 444,
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
        lineNumber: 466,
        columnNumber: 13
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 464,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 463,
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
          lineNumber: 489,
          columnNumber: 13
        }))
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 479,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 478,
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
            lineNumber: 510,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 509,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem", opacity: 0.8 }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "YOUR VISION", startFrame: 100, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 513,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 512,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 508,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 496,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 495,
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
            lineNumber: 535,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 534,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "NO BOUNDARIES", startFrame: 60, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 538,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 537,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2.5rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "JUST TYPE", startFrame: 140, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 541,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 540,
            columnNumber: 11
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 521,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 520,
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
            lineNumber: 559,
            columnNumber: 11
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 548,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 547,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 406,
    columnNumber: 5
  });
};
export {
  MusicVideo
};
