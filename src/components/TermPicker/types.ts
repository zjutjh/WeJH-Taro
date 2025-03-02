export interface PickerBasicTermOption {
  year: string;
  term: "上" | "下" | "短";
}

export interface PickerWithPeriodTermOption extends PickerBasicTermOption {
  period: "期中" | "期末";
}

export type PickerTermOption<P> = P extends true
  ? PickerWithPeriodTermOption
  : PickerBasicTermOption;
