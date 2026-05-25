export const COLORS = {
  blue1: "#00249C",
  blue2: "#40CEE4",
  red1: "#C6007E",
  red2: "#E280BE",
  grey1: "#C5C5C5",

  pink: "#C6007E",
  pinkLight: "#E280BE",
  pinkPale: "#FBEDF4",
  cyan: "#40CEE4",
  cyanLight: "#7FE0EE",
  cyanPale: "#E6F8FB",
  navy: "#00249C",
  navyMid: "#001F85",
  grey2: "#9E9E9E",
  grey3: "#888",
  bgLight: "#FAFAFA",
  white: "#FFFFFF",
  border: "#E0E0E0",
} as const;

export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.blue2} 0%, ${COLORS.blue1} 100%)`,
  pinkCyan: `linear-gradient(to bottom, ${COLORS.red1}, ${COLORS.blue2})`,
  tableHeader: `linear-gradient(90deg, ${COLORS.red1} 0%, #A30068 100%)`,
} as const;

export const API_URL = import.meta.env.VITE_API_URL || "monitoring-innovation-backend-production.up.railway.app";

export const ASSETS = {
  logo: "/assets/logo-mi.png",
  logoSmall: "/assets/logo-mi-small.png",
  demoCars: [
    "/assets/demo-toyota-supra.png",
    "/assets/demo-mazda-mx5.png",
    "/assets/demo-honda-nsx.png",
    "/assets/demo-nissan-gtr.png",
    "/assets/demo-mitsubishi-evo.png",
  ],
} as const;

export function placeholderCarFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ASSETS.demoCars[h % ASSETS.demoCars.length];
}
