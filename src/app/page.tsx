"use client";

import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const delay = async (seconds: number) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

const NUM_RECORDS = 10;

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [scope, animate] = useAnimate();

  const [records, setRecords] = useState<number[]>([120, 220, 50, 350, 270]);

  const handleSlideUpdate = useCallback(
    async (newSlide: number) => {
      setSlide(newSlide);

      if (newSlide === 1) {
        // Main axis
        await animate(
          "#arrow-body",
          { pathLength: 1, opacity: 1 },
          { duration: 1 }
        );

        // Arrow lines
        await animate(
          "#arrow-head",
          { pathLength: 1, opacity: 1 },
          { duration: 1 }
        );
      } else if (newSlide === 2) {
        // Draw the records
        for (let i = 0; i < records.length; i++) {
          await animate(`.record-${i}`, { opacity: 1 }, { duration: 0.5 });
        }
      } else if (newSlide == 3) {
        // Snap each record to the nearest 100 greater than it
        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const snap = Math.ceil(record / 100) * 100;
          const translate = snap - record;
          console.log(record, translate);

          await animate(`.record-${i}`, { x: snap }, { duration: 0.5 });
        }
      } else if (newSlide == 4) {
        // Turn all the records into squares
        let promises = [];
        for (let i = 0; i < records.length; i++) {
          promises.push(
            animate(`.record-${i}`, { rx: 0, rotate: 90 }, { duration: 1 })
          );
        }
        await Promise.all(promises);
      } else if (newSlide == 5) {
        // Animate them up 10 pixels while fading out opacity
        for (let i = 0; i < records.length; i++) {
          animate(`.record-${i}`, { opacity: 0, y: 310 }, { duration: 0.5 });
        }
      }
    },
    [animate, records]
  );

  useEffect(() => {
    // When the page is clicked on the right side, increment the slide
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const pageWidth = window.innerWidth;

      const isOnLeft = x < pageWidth / 2;
      if (isOnLeft) {
        handleSlideUpdate(Math.max(0, slide - 1));
      } else {
        handleSlideUpdate(slide + 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Left and right arrows
      if (e.key === "ArrowRight") {
        handleSlideUpdate(slide + 1);
      } else if (e.key === "ArrowLeft") {
        handleSlideUpdate(Math.max(0, slide - 1));
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSlideUpdate, slide]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <motion.svg
        ref={scope}
        width="600"
        height="600"
        viewBox="0 0 600 600"
        initial="hidden"
        animate="visible"
      >
        <motion.line
          id="arrow-body"
          x1="0"
          y1="300"
          x2="600"
          y2="300"
          pathLength={0}
          opacity={0}
          stroke="#ff0055"
          strokeWidth={2}
        />

        {/* Create a SVG path that looks like a greater than sign */}
        <motion.path
          id="arrow-head"
          d="M 575 290 L 600 300 L 575 310"
          fill="transparent"
          stroke="#ff0055"
          pathLength={0}
          opacity={0}
          initial={false}
          strokeWidth={2}
        />

        {/* Draw the records */}
        {records.map((record, i) => (
          <motion.rect
            className={`record-${i}`}
            key={i}
            width="30"
            height="30"
            rx="30"
            stroke="#00cc88"
            initial={{ x: record, y: 250 }}
            strokeWidth={1}
            opacity={0}
          />
        ))}
      </motion.svg>

      <input
        type="number"
        value={slide}
        onChange={(e) => handleSlideUpdate(+e.target.value)}
      />
    </main>
  );
}
