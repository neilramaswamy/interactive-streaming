/**
 * The OutOfOrder scene introduces the audience to out-of-order record handling in
 * streaming systems. It has the following shots:
 *  - Timeline (of event-time) is drawn left to right
 *  - We create (ordered) circular records on the event-time axis
 *  - We draw ticks on the timeline to show creating windows
 *  - We merge the circles into a single square with a # of elements inside it
 *  - We send these squares "downstream" by sliding them down
 *  - We add more circles to the windows, but they are out of order
 *
 */

import { useEffect } from "react";
import { SceneProps } from "./types";
import { motion } from "framer-motion";
import { d } from "./util";

const NUM_SHOTS = 10;

const initialRecords = [120, 220, 270, 340, 390, 490];

const aggregates = initialRecords.reduce<Record<number, number>>(
  (acc, record) => {
    // Count the number of records per window that ends at a multiple of 100
    const window = Math.ceil(record / 100) * 100 - 50;
    if (!acc[window]) {
      acc[window] = 0;
    }

    acc[window] += 1;
    return acc;
  },
  {}
);

const tickMarks = [100, 200, 300, 400, 500];

export const OutOfOrder = (props: SceneProps): JSX.Element => {
  const { shotIndex, onSceneComplete } = props;

  useEffect(() => {
    if (shotIndex === NUM_SHOTS) {
      onSceneComplete();
    }
  }, [shotIndex, onSceneComplete]);

  const emittedDownstreamYOffset = shotIndex >= 6 ? 75 : 0;

  return (
    <motion.svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      initial="hidden"
      animate="visible"
    >
      <motion.line
        id="arrow-body"
        initial={{
          x1: 0,
          y1: 300,
          x2: 600,
          y2: 300,
          pathLength: 0,
          opacity: 0,
        }}
        animate={{ pathLength: +(shotIndex >= 1), opacity: +(shotIndex >= 1) }}
        transition={{ duration: d(1) }}
        stroke="#ff0055"
        strokeWidth={2}
      />

      <motion.path
        id="arrow-head"
        d="M 575 290 L 600 300 L 575 310"
        initial={{
          fill: "transparent",
          stroke: "#ff0055",
          pathLength: 0,
          opacity: 0,
        }}
        animate={{ pathLength: +(shotIndex >= 1), opacity: +(shotIndex >= 1) }}
        transition={{ duration: d(1), delay: d(1) }}
        strokeWidth={2}
      />

      {initialRecords.map((record, i) => {
        // Snap to the nearest 100 multiple above you
        const windowEnd = Math.ceil(record / 100) * 100 - 50;
        // Subtract the width of the circle/square
        const visualWindowEnd = windowEnd - 15;

        return (
          <motion.rect
            className={`record-${i}`}
            key={i}
            width="30"
            height="30"
            stroke="#00cc88"
            strokeWidth={1}
            // Start off as a circle
            initial={{
              x: record,
              y: 250,
              rx: 30,
              opacity: 0,
            }}
            animate={{
              opacity: +(shotIndex >= 2),
              y: 250 + emittedDownstreamYOffset,
              x: shotIndex >= 4 ? visualWindowEnd : record,
              rx: shotIndex >= 4 ? 0 : 30,
            }}
            // transition={{
            //   delay: d(i * 0.5),
            // }}
          />
        );
      })}

      {Object.entries(aggregates).map(([window, count], i) => (
        <motion.text
          key={i}
          initial={{
            x: +window - 5,
            opacity: 0,
          }}
          animate={{
            opacity: +(shotIndex >= 5),
            y: 270 + emittedDownstreamYOffset,
          }}
          //   transition={{
          //     delay: d(i * 0.5),
          //   }}
          stroke={"#00cc88"}
        >
          {count}
        </motion.text>
      ))}

      {tickMarks.map((tick, i) => (
        <motion.line
          key={i}
          initial={{ x1: tick, y1: 295, x2: tick, y2: 305, opacity: 0 }}
          animate={{ opacity: +(shotIndex >= 3) }}
          transition={{
            duration: d(1),
            delay: d(i * 0.5),
          }}
          stroke="#00cc88"
        />
      ))}
    </motion.svg>
  );
};
