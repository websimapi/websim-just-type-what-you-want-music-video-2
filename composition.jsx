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
  linearTiming,
  fade
} from "@remotion/transitions";
import * as THREE from "three";
import * as CANNON from "cannon-es";
const TypedText = ({ text, startFrame, speed = 2 }) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(Math.max(0, frame - startFrame) / speed);
  const displayText = text.substring(0, charsToShow);
  const showCursor = Math.floor((frame - startFrame) / 15) % 2 === 0;
  return /* @__PURE__ */ jsxDEV("span", { children: [
    displayText,
    charsToShow < text.length && showCursor && /* @__PURE__ */ jsxDEV("span", { style: { opacity: 1 }, children: "|" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 31,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 28,
    columnNumber: 5
  });
};
const SandPhysicsBackground = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const canvasRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const rendererRef = React.useRef(null);
  React.useEffect(() => {
    if (sceneRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1e3
    );
    camera.position.set(0, 0, 500);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0, 0);
    const ambientLight = new THREE.AmbientLight(16777215, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(16777215, 0.9);
    directionalLight.position.set(-100, 100, 100);
    scene.add(directionalLight);
    const world = new CANNON.World();
    world.gravity.set(0, -98.2, 0);
    const sandMaterial = new CANNON.Material("sand");
    const wallMaterial = new CANNON.Material("wall");
    const contactMaterial = new CANNON.ContactMaterial(sandMaterial, wallMaterial, {
      friction: 0.5,
      restitution: 0.3
    });
    world.addContactMaterial(contactMaterial);
    const sandInstances = 350;
    const sandGeometry = new THREE.BoxGeometry(10, 10, 10);
    const sandMeshMaterial = new THREE.MeshStandardMaterial({ color: 14732713 });
    const instancedSand = new THREE.InstancedMesh(sandGeometry, sandMeshMaterial, sandInstances);
    scene.add(instancedSand);
    const sandBodies = [];
    const shape = new CANNON.Box(new CANNON.Vec3(5, 5, 5));
    for (let i = 0; i < sandInstances; i++) {
      const body = new CANNON.Body({ mass: 0.1, shape, material: sandMaterial });
      const x = (random(`sand-x-${i}`) - 0.5) * width * 0.9;
      const y = height * 0.5 - 50 - random(`sand-y-${i}`) * height * 0.4;
      body.position.set(x, y, 0);
      world.addBody(body);
      sandBodies.push(body);
    }
    const ground = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    ground.position.set(0, -height / 2, 0);
    world.addBody(ground);
    const leftWall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Plane() });
    leftWall.quaternion.setFromEuler(0, Math.PI / 2, 0);
    leftWall.position.set(-width / 2, 0, 0);
    world.addBody(leftWall);
    const rightWall = new CANNON.Body({ mass: 0, material: wallMaterial, shape: new CANNON.Plane() });
    rightWall.quaternion.setFromEuler(0, -Math.PI / 2, 0);
    rightWall.position.set(width / 2, 0, 0);
    world.addBody(rightWall);
    const waveShape = new CANNON.Box(new CANNON.Vec3(width / 2, 50, 50));
    const waveBody = new CANNON.Body({ mass: 0, shape: waveShape, type: CANNON.Body.KINEMATIC });
    world.addBody(waveBody);
    const waterGeometry = new THREE.PlaneGeometry(width * 2, height);
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 2254506,
      transparent: true,
      opacity: 0.6,
      roughness: 0.3,
      metalness: 0.1
    });
    const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
    scene.add(waterPlane);
    sceneRef.current = {
      scene,
      camera,
      world,
      instancedSand,
      sandBodies,
      waveBody,
      waterPlane
    };
    rendererRef.current = renderer;
  }, [width, height]);
  React.useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return;
    const { scene, camera, world, instancedSand, sandBodies, waveBody, waterPlane } = sceneRef.current;
    const renderer = rendererRef.current;
    const time = frame / 30;
    const waveCycle = Math.sin(time * 1.5) * 0.5 + 0.5;
    const waveY = -height * 0.1 + waveCycle * height * 0.4;
    waveBody.position.y = waveY;
    waterPlane.position.y = waveY - 80;
    waterPlane.position.x = Math.sin(time) * 30;
    world.step(1 / 30);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < sandBodies.length; i++) {
      dummy.position.copy(sandBodies[i].position);
      dummy.quaternion.copy(sandBodies[i].quaternion);
      dummy.updateMatrix();
      instancedSand.setMatrixAt(i, dummy.matrix);
    }
    instancedSand.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }, [frame, height]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV("canvas", { ref: canvasRef, style: { width: "100%", height: "100%" } }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 184,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 183,
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
        lineNumber: 207,
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
        lineNumber: 216,
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
            lineNumber: 228,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 221,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 206,
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
      lineNumber: 270,
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
      lineNumber: 306,
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
      lineNumber: 355,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(SandPhysicsBackground, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 356,
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
          lineNumber: 371,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 360,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 359,
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
          lineNumber: 387,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 376,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 375,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Sequence, { from: 360, durationInFrames: 900, children: /* @__PURE__ */ jsxDEV(TransitionSeries, { children: words.map((item, i) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(ImageSlide, { word: item.word, imageSrc: item.src }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 397,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 396,
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
          lineNumber: 400,
          columnNumber: 17
        }
      )
    ] }, i, true, {
      fileName: "<stdin>",
      lineNumber: 395,
      columnNumber: 13
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 393,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 392,
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
        lineNumber: 414,
        columnNumber: 13
      }
    )) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 412,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 411,
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
          lineNumber: 437,
          columnNumber: 13
        }))
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 427,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 426,
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
            lineNumber: 458,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 457,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem", opacity: 0.8 }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "YOUR VISION", startFrame: 100, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 461,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 460,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 456,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 444,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 443,
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
            lineNumber: 483,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 482,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "NO BOUNDARIES", startFrame: 60, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 486,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 485,
            columnNumber: 11
          }),
          /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "2.5rem" }, children: /* @__PURE__ */ jsxDEV(TypedText, { text: "JUST TYPE", startFrame: 140, speed: 2 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 489,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 488,
            columnNumber: 11
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 469,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 468,
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
            lineNumber: 507,
            columnNumber: 11
          }
        )
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
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 354,
    columnNumber: 5
  });
};
export {
  MusicVideo
};
