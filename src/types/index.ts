export interface DataPoint {
  name: string;
  date: string;
  score: number;
  params: number;
  family: string;
}

export interface ProcessedDataPoint {
  name: string;
  date: Date;
  score: number;
  params: number;
  family: string;
  x: number;
  y: number;
  z: number;
}

export interface ScatterShapeProps {
  cx?: number;
  cy?: number;
  fill?: string;
  payload?: ProcessedDataPoint;
}
