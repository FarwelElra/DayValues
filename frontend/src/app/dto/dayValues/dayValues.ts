export interface DayValues {
  id: string;
  date: Date;
  sys: number;
  dia: number;
  pulse: number;
  weight: number;
}

export interface DayValuesWithoutId {
  date: Date;
  sys: number;
  dia: number;
  pulse: number;
  weight: number;
}

export interface DayValueId {
  id: String
}
