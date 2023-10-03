export interface PollutionData {
  type: 'city_stat'

  AQI?: number;
  CO?: number;
  NO2?: number;
  OZONE?: number;
  PM10?: number;
  PM25?: number;
  SO2?: number;

  [key: string]: any;
}

export interface AISummary {
  type: 'ai_summary'
  content: string
}