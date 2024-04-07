import { useEffect } from "react";
import { SceneProps } from "./types";
import { ArrowHead } from "./ArrowHead";
import { motion } from "framer-motion";
import { TransformableRecord, TransformableText } from "./AggregationHelpers";
import { TrackingSegment } from "./TrackingSegment";
import { Ticks } from "./Ticks";

const fromWatermarkShotIndexToLargestEventTime = (
  shotIndex: number
): number => {
  if (shotIndex >= WM_SHOT_400_1) {
    return watermarkRecords[5];
  } else if (shotIndex >= WM_SHOT_300_1) {
    return watermarkRecords[4];
  } else if (shotIndex >= WM_SHOT_200_2) {
    return watermarkRecords[3];
  } else if (shotIndex >= WM_SHOT_200_1) {
    return watermarkRecords[2];
  } else if (shotIndex >= WM_SHOT_100_2) {
    return watermarkRecords[1];
  } else if (shotIndex >= WM_SHOT_100_1) {
    return watermarkRecords[0];
  } else {
    return 0;
  }
};

const watermarkRecords = [125, 175, 230, 270, 320, 420];
const watermarkOOORecords = [250];
const WATERMARK_DELAY = 100;

const WM_SHOT_TIMELINE = 0;
const WM_SHOT_TICKS = 1;
const WM_SHOT_100_1 = 2;
const WM_SHOT_100_2 = 3;
const WM_SHOT_200_1 = 4;
const WM_SHOT_200_2 = 5;
const WM_SHOT_300_1 = 6;
// Watermark is now 320 - 100 = 220
const WM_SHOT_SQUARE_100 = 7;
const WM_SHOT_EMIT_100 = 8;
// We receive the out-of-order record at 250
const WM_SHOT_OOO_200 = 9;
const WM_SHOT_400_1 = 10;
// Watermark is now 420 - 100 = 320
const WM_SHOT_SQUARE_200 = 11;
const WM_SHOT_EMIT_200 = 12;
const WM_NUM_SHOTS = 13;

export const OutOfOrderWithWatermark = (props: SceneProps): JSX.Element => {
  const { shotIndex, onSceneComplete } = props;

  useEffect(() => {
    if (shotIndex === WM_NUM_SHOTS) {
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
      <ArrowHead
        show={shotIndex >= WM_SHOT_TIMELINE}
        y={300}
        from={0}
        to={600}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkRecords[0]}
        appearShotIndex={WM_SHOT_100_1}
        aggregateShotIndex={WM_SHOT_SQUARE_100}
        emitShotIndex={WM_SHOT_EMIT_100}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkRecords[1]}
        appearShotIndex={WM_SHOT_100_2}
        aggregateShotIndex={WM_SHOT_SQUARE_100}
        emitShotIndex={WM_SHOT_EMIT_100}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkRecords[2]}
        appearShotIndex={WM_SHOT_200_1}
        aggregateShotIndex={WM_SHOT_SQUARE_200}
        emitShotIndex={WM_SHOT_EMIT_200}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkRecords[3]}
        appearShotIndex={WM_SHOT_200_2}
        aggregateShotIndex={WM_SHOT_SQUARE_200}
        emitShotIndex={WM_SHOT_EMIT_200}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkRecords[4]}
        appearShotIndex={WM_SHOT_300_1}
        aggregateShotIndex={Infinity}
        emitShotIndex={Infinity}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkOOORecords[0]}
        appearShotIndex={WM_SHOT_OOO_200}
        aggregateShotIndex={WM_SHOT_SQUARE_200}
        emitShotIndex={WM_SHOT_EMIT_200}
      />

      <TransformableRecord
        shotIndex={shotIndex}
        eventTime={watermarkRecords[5]}
        appearShotIndex={WM_SHOT_400_1}
        aggregateShotIndex={Infinity}
        emitShotIndex={Infinity}
      />

      <TransformableText
        shotIndex={shotIndex}
        windowEnd={200}
        text="2"
        appearShotIndex={WM_SHOT_SQUARE_100}
        emitShotIndex={WM_SHOT_EMIT_100}
      />

      <TransformableText
        shotIndex={shotIndex}
        windowEnd={300}
        text="3"
        appearShotIndex={WM_SHOT_SQUARE_200}
        emitShotIndex={WM_SHOT_EMIT_200}
      />

      {/* Watermark */}
      <TrackingSegment
        stroke="blue"
        from={0}
        to={
          fromWatermarkShotIndexToLargestEventTime(shotIndex) - WATERMARK_DELAY
        }
        y={300}
      />

      {/* Render the delay area in orange */}
      <TrackingSegment
        stroke="orange"
        from={
          fromWatermarkShotIndexToLargestEventTime(shotIndex) - WATERMARK_DELAY
        }
        to={fromWatermarkShotIndexToLargestEventTime(shotIndex)}
        y={300}
      />

      {/* Render ticks at the end so they're on top of everything */}
      <Ticks
        show={shotIndex >= WM_SHOT_TICKS}
        from={0}
        to={600}
        y={300}
        spacing={100}
      />
    </motion.svg>
  );
};
