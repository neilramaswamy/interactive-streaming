import { motion } from "framer-motion";

interface Props {
  // Style
  stroke: string;

  // Positioning
  from: number;
  to: number;
  y: number;
}

export const TrackingSegment = (props: Props): JSX.Element => {
  const { stroke, y, from, to } = props;

  return (
    <motion.line
      initial={{ x1: from, y1: y, x2: to, y2: y }}
      animate={{ x1: from, x2: to }}
      stroke={stroke}
      strokeWidth={2}
    />
  );
};
