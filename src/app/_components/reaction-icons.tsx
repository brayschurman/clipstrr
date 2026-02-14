import {
  Banana,
  Bomb,
  BrainCircuit,
  Bug,
  Drama,
  Ghost,
  PartyPopper,
  Rocket,
  Siren,
  Skull,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ReactionIconDefinition = {
  key: string;
  label: string;
  keywords: string[];
  Icon: LucideIcon;
};

const REACTION_ICON_TOKEN_PREFIX = "icon:";

export const REACTION_ICONS: ReactionIconDefinition[] = [
  {
    key: "chaos",
    label: "Chaos",
    keywords: ["chaos", "explosion", "boom"],
    Icon: Bomb,
  },
  {
    key: "brain-melt",
    label: "Brain Melt",
    keywords: ["brain", "wtf", "mind blown"],
    Icon: BrainCircuit,
  },
  {
    key: "bonk",
    label: "Bonk",
    keywords: ["bonk", "horny jail", "siren"],
    Icon: Siren,
  },
  {
    key: "plot-twist",
    label: "Plot Twist",
    keywords: ["plot", "twist", "drama"],
    Icon: Drama,
  },
  {
    key: "ship-it",
    label: "Ship It",
    keywords: ["ship", "launch", "rocket"],
    Icon: Rocket,
  },
  {
    key: "screaming",
    label: "Screaming",
    keywords: ["scream", "skull", "dead"],
    Icon: Skull,
  },
  {
    key: "haunted",
    label: "Haunted",
    keywords: ["ghost", "haunted", "spooky"],
    Icon: Ghost,
  },
  {
    key: "sus",
    label: "Sus",
    keywords: ["sus", "bug", "questionable"],
    Icon: Bug,
  },
  {
    key: "goofy",
    label: "Goofy",
    keywords: ["banana", "goofy", "silly"],
    Icon: Banana,
  },
  {
    key: "cracked",
    label: "Cracked",
    keywords: ["cracked", "elite", "zap"],
    Icon: Zap,
  },
  {
    key: "party-mode",
    label: "Party Mode",
    keywords: ["party", "celebrate", "hype"],
    Icon: PartyPopper,
  },
];

export function getReactionTokenFromIconKey(key: string): string {
  return `${REACTION_ICON_TOKEN_PREFIX}${key}`;
}

export function getReactionIconByToken(token: string): ReactionIconDefinition | null {
  if (!token.startsWith(REACTION_ICON_TOKEN_PREFIX)) {
    return null;
  }

  const key = token.slice(REACTION_ICON_TOKEN_PREFIX.length);
  return REACTION_ICONS.find((icon) => icon.key === key) ?? null;
}
