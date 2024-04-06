import { SceneProps } from "./types";
import { PowerpointSlide } from "./PowerpointSlide";

export const OutOfOrderSummary = (props: SceneProps): JSX.Element => {
  return (
    <PowerpointSlide
      header="Recap"
      bulletPoints={[
        "Streaming engines are SQL engines that deal with out-of-order events",
        "To deal with out-of-orderness, they keep state (i.e. buffers of records) and at some point compute results",
        "Our goal: determine when we should compute results, to emit 1 definitive aggregate",
      ]}
      {...props}
    />
  );
};
