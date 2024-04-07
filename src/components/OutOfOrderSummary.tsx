import { SceneProps } from "./types";
import { PowerpointSlide } from "./PowerpointSlide";

export const OutOfOrderSummary = (props: SceneProps): JSX.Element => {
  return (
    <PowerpointSlide
      header="Recap"
      bulletPoints={[
        "Streaming engines are SQL engines that operates over data as it arrives",
        "Critically, they implement ways to handle out-of-orderness",
        "Our goal: determine when we should compute results, to emit 1 definitive aggregate",
      ]}
      {...props}
    />
  );
};
