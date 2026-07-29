// Demo solar estimator logic. All outputs are ILLUSTRATIVE ranges only.
// Final system sizing depends on consumption data, equipment selection,
// the property and a technical site assessment.

export interface EstimatorInput {
  propertyType: 'home' | 'business'
  monthlyBill: number // Rand per month
  daytimeUsage: 'low' | 'medium' | 'high'
  backup: 'none' | 'essentials' | 'most'
  batteryInterest: boolean
  location: string
}

export interface EstimateResult {
  systemKwMin: number
  systemKwMax: number
  dailyKwhMin: number
  dailyKwhMax: number
  batteryKwhMin: number
  batteryKwhMax: number
  consultation: string
}

const roundHalf = (n: number) => Math.max(0.5, Math.round(n * 2) / 2)

export function estimate(input: EstimatorInput): EstimateResult {
  // Rough demo assumptions: blended tariff ~ R3.50/kWh, ~4.8 average
  // peak-sun hours per day in the Western Cape.
  const monthlyKwh = input.monthlyBill / 3.5
  const dailyKwh = monthlyKwh / 30

  const daytimeFactor =
    input.daytimeUsage === 'high' ? 0.65 : input.daytimeUsage === 'medium' ? 0.5 : 0.35
  const targetDaily = dailyKwh * (input.batteryInterest ? 0.85 : daytimeFactor + 0.15)
  const baseKw = targetDaily / 4.8

  const systemKwMin = roundHalf(baseKw * 0.85)
  const systemKwMax = roundHalf(Math.max(baseKw * 1.2, systemKwMin + 1))

  const dailyKwhMin = Math.round(systemKwMin * 4.2)
  const dailyKwhMax = Math.round(systemKwMax * 5.2)

  let batteryKwhMin = 0
  let batteryKwhMax = 0
  if (input.batteryInterest || input.backup !== 'none') {
    const backupFactor = input.backup === 'most' ? 0.6 : 0.35
    batteryKwhMin = Math.max(5, Math.round((dailyKwh * backupFactor) / 2.5) * 2.5)
    batteryKwhMax = batteryKwhMin + (input.propertyType === 'business' ? 10 : 5)
  }

  const consultation =
    input.propertyType === 'business'
      ? 'Commercial site consultation'
      : batteryKwhMin > 0
        ? 'Home solar and storage consultation'
        : 'Home solar consultation'

  return {
    systemKwMin,
    systemKwMax,
    dailyKwhMin,
    dailyKwhMax,
    batteryKwhMin,
    batteryKwhMax,
    consultation
  }
}
