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

const getTextWindowX = (window: number): number => getWindowCenter(window) - 5;

// Record stuff
// Both width and height
const RECORD_SIZE = 30;

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

interface TransformableRecordProps {
  // The current shot index
  shotIndex: number;

  // The x-timestamp at which this record was created
  eventTime: number;

  // The shot index at which this becomes visible
  appearShotIndex: number;
  // The shot index at which this becomes a square and goes to the center of its window
  aggregateShotIndex: number;
  // The shot index at which this should be emitted downstream (i.e. slide down)
  emitShotIndex: number;
}

const getVisualX = (eventTime: number): number => eventTime - RECORD_SIZE / 2;
const getVisualWindowX = (eventTime: number): number =>
  getWindowCenter(eventTime) - RECORD_SIZE / 2;

const TransformableRecord = (props: TransformableRecordProps): JSX.Element => {
  const {
    shotIndex,
    eventTime,
    appearShotIndex,
    aggregateShotIndex,
    emitShotIndex,
  } = props;

  console.log(
    "shotIndex",
    shotIndex,
    "appearShotIndex",
    appearShotIndex,
    "aggregateShotIndex",
    aggregateShotIndex,
    "emitShotIndex",
    emitShotIndex
  );

  return (
    <motion.rect
      width={RECORD_SIZE}
      height={RECORD_SIZE}
      stroke="#00cc88"
      strokeWidth={1}
      initial={{
        x: getVisualX(eventTime),
        y: 250,
        rx: 30,
        opacity: 0,
      }}
      animate={{
        opacity: +(shotIndex >= appearShotIndex),
        x:
          shotIndex >= aggregateShotIndex
            ? getVisualWindowX(eventTime)
            : getVisualX(eventTime),
        rx: shotIndex >= aggregateShotIndex ? 0 : 30,
        y: 250 + (shotIndex >= emitShotIndex ? 75 : 0),
      }}
    />
  );
};

interface TransformableTextProps {
  shotIndex: number;

  // The x-timestamp of the end of the window this belongs to
  windowEnd: number;

  // The shot index at which this becomes visible
  appearShotIndex: number;
  // The shot index at which this should be emitted downstream (i.e. slide down)
  emitShotIndex: number;
}

const TransformableText = (props: TransformableTextProps): JSX.Element => {
  const { shotIndex, windowEnd, appearShotIndex, emitShotIndex } = props;

  return (
    <motion.text
      initial={{
        x: getTextWindowX(windowEnd),
        opacity: 0,
      }}
      animate={{
        opacity: +(shotIndex >= appearShotIndex),
        y: 270 + (shotIndex >= emitShotIndex ? 75 : 0),
      }}
      stroke={"#00cc88"}
    >
      {aggregates[windowEnd]}
    </motion.text>
  );
};

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

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={initialRecords[0]}
        appearShotIndex={SHOT_CIRCLES_100_1}
        aggregateShotIndex={SHOT_SQUARE_100}
        emitShotIndex={SHOT_EMIT_100}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={initialRecords[1]}
        appearShotIndex={SHOT_CIRCLES_100_2}
        aggregateShotIndex={SHOT_SQUARE_100}
        emitShotIndex={SHOT_EMIT_100}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={initialRecords[2]}
        appearShotIndex={SHOT_CIRCLES_200_1}
        aggregateShotIndex={SHOT_SQUARE_200}
        emitShotIndex={SHOT_EMIT_200}
      />

      {/* The window for [100, 200) */}
      <TransformableText
        shotIndex={shotIndex}
        windowEnd={200}
        appearShotIndex={SHOT_SQUARE_100}
        emitShotIndex={SHOT_EMIT_100}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={initialRecords[3]}
        appearShotIndex={SHOT_CIRCLES_200_2}
        aggregateShotIndex={SHOT_SQUARE_200}
        emitShotIndex={SHOT_EMIT_200}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={initialRecords[4]}
        appearShotIndex={SHOT_CIRCLES_300_1}
        aggregateShotIndex={Infinity}
        emitShotIndex={Infinity}
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

      <TransformableText
        shotIndex={shotIndex}
        windowEnd={300}
        appearShotIndex={SHOT_SQUARE_200}
        emitShotIndex={SHOT_EMIT_200}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={outOfOrderRecords[0]}
        appearShotIndex={SHOT_OOO_100}
        aggregateShotIndex={Infinity}
        emitShotIndex={Infinity}
      />
    </motion.svg>
  );
};
