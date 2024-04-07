import { motion } from "framer-motion";
import { d } from "./util";

interface Props {
  show: boolean;

  from: number;
  to: number;
  y: number;

  spacing: number;
}

const TICK_HEIGHT = 10;

export const Ticks = (props: Props): JSX.Element => {
  const { show, from, to, y, spacing } = props;

  // Fail fast
  if (from >= to) throw new Error("from must be less than to");

  const numTicks = Math.ceil((to - from) / spacing) - 1;

  return (
    <>
      {Array.from(Array(numTicks).keys()).map((i) => (
        <motion.line
          key={`tick-${i}`}
          initial={{
            x1: (i + 1) * spacing,
            y1: y - TICK_HEIGHT / 2,
            x2: (i + 1) * spacing,
            y2: y + TICK_HEIGHT / 2,
            opacity: 0,
          }}
          animate={{ opacity: +show }}
          transition={{
            duration: d(0.5),
            delay: d(i * 0.5),
          }}
          stroke="#00cc88"
          strokeWidth={1.5}
        />
      ))}
    </>
  );
};
