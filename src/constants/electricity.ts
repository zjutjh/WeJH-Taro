import { CampusOption } from "@/api/types/electricity";

import { Option } from ".";

export const CAMPUS_OPTION = [
  { label: "朝晖/屏峰", value: "zhpf" },
  { label: "莫干山", value: "mgs" }
] as const satisfies Option<CampusOption>[];
