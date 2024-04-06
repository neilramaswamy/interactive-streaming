"use client";

import { DelayDistribution } from "@/components/DelayDistribution";
import { Intro } from "@/components/Intro";
import { OutOfOrder } from "@/components/OutOfOrder";
import { OutOfOrderSummary } from "@/components/OutOfOrderSummary";
import { SceneProps } from "@/components/types";
import { useCallback, useEffect, useState } from "react";

// Scenes should be a list of React components that have SceneProps as Props
const SCENES: React.FC<SceneProps>[] = [
  Intro,
  OutOfOrder,
  OutOfOrderSummary,
  DelayDistribution,
];

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
        // Prevent the page from scrolling in case we're zoomed in
        e.preventDefault();
        changeShotIndex(shotIndex + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
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
    <main className="flex min-h-screen flex-col justify-between p-24">
      <CurrentScene
        shotIndex={shotIndex}
        onSceneComplete={() => {
          const isOver = sceneIndex === SCENES.length - 1;
          if (!isOver) {
            setSceneIndex(sceneIndex + 1);
            setShotIndex(0);
          } else {
            console.log("Presentation is over!");
          }
        }}
      />

      <input
        className="self-center"
        type="number"
        value={shotIndex}
        onChange={(e) => changeShotIndex(+e.target.value)}
      />
    </main>
  );
}
