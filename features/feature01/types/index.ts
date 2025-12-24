// Here is where we will put all the types for the feature

export interface Feature01State {
  state1: string;
  state2: number;
  // here is where we will put all the types for the feature
}

export interface Feature01Actions {
  setState1: (state1: string) => void;
  setState2: (state2: number) => void;
}

export interface Feature01Slice {
  featureState: Feature01State;
  featureActions: Feature01Actions;
}
