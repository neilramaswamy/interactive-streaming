"use client";

import { OutOfOrder } from "@/components/OutOfOrder";
import { Scene } from "@/components/scene";
import { SceneProps } from "@/components/types";
import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

// Scenes should be a list of React components that have SceneProps as Props
const SCENES: React.FC<SceneProps>[] = [OutOfOrder, Scene];

export default function Home() {
  // sceneIndex tracks our progress through SCENES, and shotIndex tracks our
  // progress through the shots in the current scene. When the current scene
  // invokes its onSceneComplete callback, we increment sceneIndex and reset
  // shotIndex to 0.
  const [sceneIndex, setSceneIndex] = useState(0);
  const [shotIndex, setShotIndex] = useState(0);

  const changeShotIndex = useCallback(
    async (newShotIndex: number) => {
      // Go to the previous scene
      if (newShotIndex < 0) {
        setSceneIndex(Math.max(0, sceneIndex - 1));
        setShotIndex(0);
      } else {
        setShotIndex(newShotIndex);
      }
    },
    [sceneIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left and right arrows
      if (e.key === "ArrowRight") {
        changeShotIndex(shotIndex + 1);
      } else if (e.key === "ArrowLeft") {
        changeShotIndex(shotIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shotIndex, changeShotIndex]);

  const CurrentScene = SCENES[sceneIndex];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CurrentScene
        shotIndex={shotIndex}
        onSceneComplete={() => {
          const isOver = sceneIndex === SCENES.length - 1;
          if (!isOver) {
            setSceneIndex(sceneIndex + 1);
            setShotIndex(0);
          }
        }}
      />

      <input
        type="number"
        value={shotIndex}
        onChange={(e) => changeShotIndex(+e.target.value)}
      />
    </main>
  );
}
