export type FishSpec = {
  id: number; // 실제 Sprite에 주입할 id
  species: string; // 예: "SpaceOcto_4", "RBFishbun_1"
};

export type Contributor = {
  id: number;
  user: string;
  commitCount: number;
  fish: FishSpec;
};
