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
const NUM_SHOTS = 12;

const SHOT_TIMELINE = 0;
const SHOT_TICKS = 1;
const SHOT_CIRCLES_100_1 = 2;
const SHOT_CIRCLES_100_2 = 3;
const SHOT_CIRCLES_200_1 = 4;
const SHOT_SQUARE_100 = 5;
const SHOT_EMIT_100 = 6;
const SHOT_CIRCLES_200_2 = 7;
const SHOT_CIRCLES_300_1 = 8;
const SHOT_SQUARE_200 = 9;
const SHOT_EMIT_200 = 10;
const SHOT_OOO_100 = 11;

const getWindow = (record: number): number => {
  return Math.ceil(record / 100) * 100;
};

const getWindowCenter = (record: number): number => {
  return getWindow(record) - 50;
};

// Record stuff
// Both width and height
const RECORD_SIZE = 30;

const getRecordX = (i: number): number => initialRecords[i] - RECORD_SIZE / 2;
const getWindowX = (i: number): number =>
  getWindowCenter(initialRecords[i]) - RECORD_SIZE / 2;
const getTextWindowX = (window: number): number => window - 50 - 5;

const initialRecords = [125, 175, 230, 270, 420];

const aggregates = initialRecords.reduce<Record<number, number>>(
  (acc, record) => {
    // Count the number of records per window that ends at a multiple of 100
    const window = Math.ceil(record / 100) * 100;
    if (!acc[window]) {
      acc[window] = 0;
    }

    acc[window] += 1;
    return acc;
  },
  {}
);

// Intentionally center these so that they align with the squares
const outOfOrderRecords = [160];

const tickMarks = [100, 200, 300, 400, 500];

export const OutOfOrder = (props: SceneProps): JSX.Element => {
  const { shotIndex, onSceneComplete } = props;

  useEffect(() => {
    if (shotIndex === NUM_SHOTS) {
      onSceneComplete();
    }
  }, [shotIndex, onSceneComplete]);

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

      <motion.rect
        key={`record-0`}
        width={RECORD_SIZE}
        height={RECORD_SIZE}
        stroke="#00cc88"
        strokeWidth={1}
        // Start off as a circle
        initial={{
          x: getRecordX(0),
          y: 250,
          rx: 30,
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_CIRCLES_100_1),
          y: 250 + (shotIndex >= SHOT_EMIT_100 ? 75 : 0),
          x: shotIndex >= SHOT_SQUARE_100 ? getWindowX(0) : getRecordX(0),
          rx: shotIndex >= SHOT_SQUARE_100 ? 0 : 30,
        }}
      />

      <motion.rect
        key={`record-1`}
        width={RECORD_SIZE}
        height={RECORD_SIZE}
        stroke="#00cc88"
        strokeWidth={1}
        // Start off as a circle
        initial={{
          x: getRecordX(1),
          y: 250,
          rx: 30,
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_CIRCLES_100_2),
          y: 250 + (shotIndex >= SHOT_EMIT_100 ? 75 : 0),
          x: shotIndex >= SHOT_SQUARE_100 ? getWindowX(1) : getRecordX(1),
          rx: shotIndex >= SHOT_SQUARE_100 ? 0 : 30,
        }}
      />

      <motion.rect
        key={`record-2`}
        width={RECORD_SIZE}
        height={RECORD_SIZE}
        stroke="#00cc88"
        strokeWidth={1}
        // Start off as a circle
        initial={{
          x: getRecordX(2),
          y: 250,
          rx: 30,
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_CIRCLES_200_1),
          y: 250 + (shotIndex >= SHOT_EMIT_200 ? 75 : 0),
          x: shotIndex >= SHOT_SQUARE_200 ? getWindowX(2) : getRecordX(2),
          rx: shotIndex >= SHOT_SQUARE_200 ? 0 : 30,
        }}
      />

      <motion.text
        key={`text-0`}
        initial={{
          x: getTextWindowX(200),
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_SQUARE_100),
          y: 270 + (shotIndex >= SHOT_EMIT_100 ? 75 : 0),
        }}
        stroke={"#00cc88"}
      >
        {aggregates[200]}
      </motion.text>

      <motion.rect
        key={`record-3`}
        width={RECORD_SIZE}
        height={RECORD_SIZE}
        stroke="#00cc88"
        strokeWidth={1}
        // Start off as a circle
        initial={{
          x: getRecordX(3),
          y: 250,
          rx: 30,
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_CIRCLES_200_2),
          y: 250 + (shotIndex >= SHOT_EMIT_200 ? 75 : 0),
          x: shotIndex >= SHOT_SQUARE_200 ? getWindowX(3) : getRecordX(3),
          rx: shotIndex >= SHOT_SQUARE_200 ? 0 : 30,
        }}
      />

      <motion.rect
        key={`record-4`}
        width={RECORD_SIZE}
        height={RECORD_SIZE}
        stroke="#00cc88"
        strokeWidth={1}
        // Start off as a circle
        initial={{
          x: getRecordX(4),
          y: 250,
          rx: 30,
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_CIRCLES_300_1),
          y: 250,
          x: getRecordX(4),
          rx: 30,
        }}
      />

      {tickMarks.map((tick, i) => (
        <motion.line
          key={`tick-${i}`}
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

      <motion.text
        key={`text-1`}
        initial={{
          x: getTextWindowX(300),
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_SQUARE_200),
          y: 270 + (shotIndex >= SHOT_EMIT_200 ? 75 : 0),
        }}
        stroke={"#00cc88"}
      >
        {aggregates[300]}
      </motion.text>

      <motion.rect
        key={`record-5`}
        width={RECORD_SIZE}
        height={RECORD_SIZE}
        stroke="#00cc88"
        strokeWidth={1}
        initial={{
          x: outOfOrderRecords[0] - RECORD_SIZE / 2,
          y: 250,
          rx: 30,
          opacity: 0,
        }}
        animate={{
          opacity: +(shotIndex >= SHOT_OOO_100),
        }}
      />
    </motion.svg>
  );
};
