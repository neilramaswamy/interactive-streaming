import { SceneProps } from "./types";
import { PowerpointSlide } from "./PowerpointSlide";

export const FundamentalTradeoff = (props: SceneProps): JSX.Element => {
  return (
    <PowerpointSlide
      header="The Fundamental Tradeoff of Streaming Systems"
      bulletPoints={[
        "Emitting immediately is low latency, but low completeness",
        "Waiting longer is high latency, but high completeness",
        "Our choice of delay, from the delay distribution, configures this tradeoff",
      ]}
      {...props}
    />
  );
};
