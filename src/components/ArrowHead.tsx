import { motion } from "framer-motion";
import { d } from "./util";

interface Props {
  show: boolean;

  from: number;
  to: number;
  y: number;
}

const ARROWHEAD_HORIZONTAL_OFFSET = 25;
const ARROWHEAD_VERTICAL_OFFSET = 10;

const AHO = ARROWHEAD_HORIZONTAL_OFFSET;
const AVO = ARROWHEAD_VERTICAL_OFFSET;

export const ArrowHead = (props: Props): JSX.Element => {
  const { show, from, to, y } = props;

  return (
    <>
      <motion.line
        id="arrow-body"
        initial={{
          x1: from,
          y1: y,
          x2: to,
          y2: y,
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: +show,
          opacity: +show,
        }}
        transition={{ duration: d(1) }}
        stroke="#ff0055"
        strokeWidth={2}
      />

      <motion.path
        id="arrow-head"
        d={`M ${to - AHO} ${y - AVO} L ${to} ${y} L ${to - AHO} ${y + AVO}`}
        initial={{
          fill: "transparent",
          stroke: "#ff0055",
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: +show,
          opacity: +show,
        }}
        transition={{ duration: d(1), delay: d(1) }}
        strokeWidth={2}
      />
    </>
  );
};
