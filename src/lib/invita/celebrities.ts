import catalog from "@/data/celebrities.json";

export type CelebrityClient = {
  id: string;
  name: string;
  handle: string;
  image: string;
};

export const CELEBRITY_CLIENTS: CelebrityClient[] = catalog as CelebrityClient[];
