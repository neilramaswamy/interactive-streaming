import { motion } from "framer-motion";

const getVisualX = (eventTime: number): number => eventTime - RECORD_SIZE / 2;
const getVisualWindowX = (eventTime: number): number =>
  getWindowCenter(eventTime) - RECORD_SIZE / 2;

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

export const TransformableRecord = (
  props: TransformableRecordProps
): JSX.Element => {
  const {
    shotIndex,
    eventTime,
    appearShotIndex,
    aggregateShotIndex,
    emitShotIndex,
  } = props;

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
  text: string;

  shotIndex: number;

  // The x-timestamp of the end of the window this belongs to
  windowEnd: number;

  // The shot index at which this becomes visible
  appearShotIndex: number;
  // The shot index at which this should be emitted downstream (i.e. slide down)
  emitShotIndex: number;
}

export const TransformableText = (
  props: TransformableTextProps
): JSX.Element => {
  const { text, shotIndex, windowEnd, appearShotIndex, emitShotIndex } = props;

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
      {text}
    </motion.text>
  );
};
