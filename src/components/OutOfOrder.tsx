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

import { motion } from "framer-motion";
import { useEffect } from "react";
import { SceneProps } from "./types";
import { d } from "./util";

// Shot names
const NUM_SHOTS = 6;

const SHOT_TIMELINE = 0;
const SHOT_CIRCLES = 1;
const SHOT_TICKS = 2;
const SHOT_SQUARES = 3;
const SHOT_DOWNSTREAM = 4;
const SHOT_OUT_OF_ORDER = 5;

// Record stuff
// Both width and height
const RECORD_SIZE = 30;

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

// Intentionally center these so that they align with the squares
const outOfOrderRecords = [550, 150, 250];

const tickMarks = [100, 200, 300, 400, 500];

export const OutOfOrder = (props: SceneProps): JSX.Element => {
  const { shotIndex, onSceneComplete } = props;

  useEffect(() => {
    if (shotIndex === NUM_SHOTS) {
      onSceneComplete();
    }
  }, [shotIndex, onSceneComplete]);

  const emittedDownstreamYOffset = shotIndex >= SHOT_DOWNSTREAM ? 75 : 0;

  return (
    <motion.svg
      className="self-center"
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
        animate={{
          pathLength: +(shotIndex >= SHOT_TIMELINE),
          opacity: +(shotIndex >= SHOT_TIMELINE),
        }}
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
        animate={{
          pathLength: +(shotIndex >= SHOT_TIMELINE),
          opacity: +(shotIndex >= SHOT_TIMELINE),
        }}
        transition={{ duration: d(1), delay: d(1) }}
        strokeWidth={2}
      />

      {initialRecords.map((record, i) => {
        // Snap to the nearest 100 multiple above you
        const windowEnd = Math.ceil(record / 100) * 100 - 50;
        // Subtract the width of the circle/square
        const visualWindowEnd = windowEnd - RECORD_SIZE / 2;

        return (
          <motion.rect
            className={`record-${i}`}
            key={i}
            width={RECORD_SIZE}
            height={RECORD_SIZE}
            stroke="#00cc88"
            strokeWidth={1}
            // Start off as a circle
            initial={{
              x: record - RECORD_SIZE / 2,
              y: 250,
              rx: 30,
              opacity: 0,
            }}
            animate={{
              opacity: +(shotIndex >= SHOT_CIRCLES),
              y: 250 + emittedDownstreamYOffset,
              x: shotIndex >= SHOT_SQUARES ? visualWindowEnd : record,
              rx: shotIndex >= SHOT_SQUARES ? 0 : 30,
            }}
            transition={{
              delay: shotIndex <= SHOT_CIRCLES ? d(i * 0.5) : 0,
            }}
          />
        );
      })}

      {tickMarks.map((tick, i) => (
        <motion.line
          key={i}
          initial={{ x1: tick, y1: 290, x2: tick, y2: 310, opacity: 0 }}
          animate={{ opacity: +(shotIndex >= SHOT_TICKS) }}
          transition={{
            duration: d(0.5),
            delay: d(i * 0.5),
          }}
          stroke="#00cc88"
          strokeWidth={1.5}
        />
      ))}

      {Object.entries(aggregates).map(([window, count], i) => (
        <motion.text
          key={i}
          initial={{
            x: +window - 5,
            opacity: 0,
          }}
          animate={{
            opacity: +(shotIndex >= SHOT_SQUARES),
            y: 270 + emittedDownstreamYOffset,
          }}
          stroke={"#00cc88"}
        >
          {count}
        </motion.text>
      ))}

      {outOfOrderRecords.map((record, i) => {
        return (
          <motion.rect
            className={`ooo-record-${i}`}
            key={i}
            width={RECORD_SIZE}
            height={RECORD_SIZE}
            stroke="#00cc88"
            strokeWidth={1}
            // Start off as a circle
            initial={{
              x: record - RECORD_SIZE / 2,
              y: 250,
              rx: 30,
              opacity: 0,
            }}
            animate={{
              opacity: +(shotIndex >= SHOT_OUT_OF_ORDER),
            }}
            transition={{
              delay: d(i * 0.5),
            }}
          />
        );
      })}
    </motion.svg>
  );
};
