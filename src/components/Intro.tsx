import { PowerpointSlide } from "./PowerpointSlide";
import { SceneProps } from "./types";

export const Intro = (props: SceneProps): JSX.Element => {
  return (
    <PowerpointSlide
      header="Correct and low-latency real-time streaming joins"
      bulletPoints={[
        "I'm Neil Ramaswamy. I work at Databricks.",
        "I work on our streaming engine's runtime, mostly on performance",
        "Today: basics of streaming, all the way up to how we implement streaming joins",
      ]}
      {...props}
    />
  );
};
