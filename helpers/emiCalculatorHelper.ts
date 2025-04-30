import Big from 'big.js';

export class EmiCalculatorHelper {
  private readonly loanAmount: Big
  private readonly interestRate: Big
  // loanTenureInMonths has to be of number type, because pow() 
  // method accepts only number type argument.
  private readonly loanTenureInMonths: number

  constructor(loanAmount: number, interestRate: number, loanTenureInMonths: number) {
    this.loanAmount = new Big(loanAmount)
    this.interestRate = new Big(interestRate)
    this.loanTenureInMonths = loanTenureInMonths
  }

  roundedEmiAmount(): number {
    return Math.round(this.emiAmount())
  }

  roundedTotalAmount(): number {
    return Math.round(this.totalAmount())
  }

  roundedTotalInterest(): number {
    return Math.round(this.totalInterest())
  }

  roundedTotalInterestPercentage(): string {
    const totalInterestPercentage = this.totalInterest().div(this.totalAmount()).times(100)
    return `${totalInterestPercentage.toFixed(1)}%`
  }

  roundedPrincipalAmountPercentage(): string {
    const principalAmountPercentage = this.totalAmount().minus(this.totalInterest()).div(this.totalAmount()).times(100)
    return `${principalAmountPercentage.toFixed(1)}%`
  }

  // To achieve correct result, calculation on money needs to be done on BigDecimal type.
  // Additionaly rounding multipe times during the calculation will make result incorrect.
  private emiAmount(): Big {
    const monthlyRate = this.interestRate.div(12).div(100)
    const compoundInterestFactor = (monthlyRate.plus(1).pow(this.loanTenureInMonths))

    return this.loanAmount.times(monthlyRate).times(compoundInterestFactor).div(compoundInterestFactor.minus(1))
  }

  private totalAmount(): Big {
    return this.emiAmount().times(this.loanTenureInMonths)
  }

  private totalInterest(): Big {
    return this.totalAmount().minus(this.loanAmount)
  }
}
