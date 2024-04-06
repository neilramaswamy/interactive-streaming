import { motion } from "framer-motion";
import { useEffect } from "react";
import { SceneProps } from "./types";
import { d } from "./util";

interface PowerpointSlide extends SceneProps {
  header: string;

  bulletPoints: string[];
}

export const PowerpointSlide = (props: PowerpointSlide): JSX.Element => {
  const { shotIndex, onSceneComplete, header, bulletPoints } = props;

  useEffect(() => {
    // Add 1 so that the last bullet point can be seen
    const numShots = bulletPoints.length + 1;

    if (shotIndex === numShots) {
      onSceneComplete();
    }
  }, [shotIndex, bulletPoints, onSceneComplete]);

  return (
    <motion.div className="flex flex-col">
      <motion.h1 className="text-blue-50 text-3xl mb-2">{header}</motion.h1>

      <motion.ul className="marker:text-blue-50 list-disc ml-4">
        {bulletPoints.map((bulletPoint, index) => (
          <motion.li
            key={index}
            className="text-blue-50 text-lg mb-1"
            initial={{ opacity: 0 }}
            // shotIndex 1 corresponds to bullet point 0
            animate={{ opacity: +(shotIndex >= index + 1) }}
            transition={{ duration: d(1) }}
          >
            {bulletPoint}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};
