export interface EvolutionData {
  month: number;
  interest: number;
  totalInvested: number;
  totalInterest: number;
  totalAccumulated: number;
}

export interface CalculationResults {
  totalFinal: number;
  totalInvested: number;
  totalInterest: number;
  evolution: EvolutionData[];
}
