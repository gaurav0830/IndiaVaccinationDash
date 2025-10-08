import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const GeoLoader = ({ size = 120 }) => {
  const loaderRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    gsap.to(loaderRef.current, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: "linear",
      transformOrigin: "50% 50%",
    });

    dotsRef.current.forEach((dot, index) => {
      gsap.to(dot, {
        scale: 1.5,
        repeat: -1,
        yoyo: true,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power1.inOut",
      });
    });
  }, []);

  return (
    <div
      ref={loaderRef}
      style={{ width: size, height: size, position: "relative", margin: "auto" }}
    >
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const radius = size / 2 - 10;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#05339C",
              top: "50%",
              left: "50%",
              transform: `translate(${x}px, ${y}px) scale(0.8)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default GeoLoader;
