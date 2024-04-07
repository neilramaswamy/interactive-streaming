import { motion } from "framer-motion";
import { useEffect } from "react";
import { SceneProps } from "./types";
import { d } from "./util";
import { ArrowHead } from "./ArrowHead";
import { Ticks } from "./Ticks";
import { TrackingSegment } from "./TrackingSegment";
import { TransformableRecord, TransformableText } from "./AggregationHelpers";

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
const NUM_SHOTS = 12;

const initialRecords = [125, 175, 230, 270, 320];
const outOfOrderRecords = [250];

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
      <ArrowHead show={shotIndex >= SHOT_TIMELINE} y={300} from={0} to={600} />

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
        text="2"
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

      <Ticks
        show={shotIndex >= SHOT_TICKS}
        from={0}
        to={600}
        y={300}
        spacing={100}
      />

      <TransformableText
        shotIndex={shotIndex}
        windowEnd={300}
        text="2"
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
