import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  // The function to call when the scene is completed
  onSceneComplete: () => void;

  // The shot in the scene (when this increments, it means we're moving to the next shot in the scene)
  shotIndex: number;
}

const NUM_SHOTS = 3;

export const Scene = (props: Props): JSX.Element => {
  const [scope, animate] = useAnimate();
  const { onSceneComplete, shotIndex } = props;

  //   useEffect(() => {
  //     if (!scope.current) return;

  //     if (shotIndex === 1) {
  //       // Animate the first element
  //       animate("#a", { opacity: 1 }, { duration: 1 });
  //     } else if (shotIndex === 2) {
  //       // Animate the second element
  //       animate("#b", { opacity: 1 }, { duration: 1 });
  //     } else {
  //       // Scene is complete
  //       onSceneComplete();
  //     }
  //   }, [animate, scope, onSceneComplete, shotIndex]);
  useEffect(() => {
    if (shotIndex === NUM_SHOTS) {
      onSceneComplete();
    }
  }, [shotIndex, onSceneComplete]);

  return (
    <motion.div ref={scope}>
      <motion.span
        id="a"
        className="text-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: +(shotIndex >= 1) }}
        transition={{ duration: 1 }}
      >
        Hello
      </motion.span>
      <motion.span
        id="b"
        className="text-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: +(shotIndex >= 2) }}
        transition={{ duration: 1 }}
      >
        World
      </motion.span>
    </motion.div>
  );
};
