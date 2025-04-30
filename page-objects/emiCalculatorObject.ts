import { expect, Page } from '@playwright/test'
import { EmiCalculatorHelper } from '../helpers/emiCalculatorHelper'

export class EmiCalculatorObject {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async openHomeLoanTab() {
    const emiCalculatorDashboard = this.page.locator('#emicalculatordashboard')
    const homeLoanLink = emiCalculatorDashboard.getByRole('link', { name: 'Home Loan' })

    await homeLoanLink.click()
  }

  async fillEmiCalculatorForm(homeLoanAmount: number, interestRate: number, loanTenureYears: number) {
    const emiCalculatorForm = this.page.locator('#emicalculatorform')
    const homeLoanAmountInput = emiCalculatorForm.getByLabel('Home Loan Amount')
    const interestRateInput = emiCalculatorForm.getByLabel('Interest Rate')
    const loanTenureInput = emiCalculatorForm.getByLabel('Loan Tenure')

    await homeLoanAmountInput.fill(homeLoanAmount.toLocaleString('hi-IN'))
    await interestRateInput.fill(String(interestRate))
    await loanTenureInput.fill(String(loanTenureYears))
    // Load Tenure slider updates only after input is blurred.
    await loanTenureInput.blur()
    // Wait for Pie Chart to update calculations.
    await this.page.waitForTimeout(500)
  }

  async validateEmiPaymentsSummary(homeLoanAmount: number, interestRate: number, loanTenureYears: number) {
    const emiAmount = await this.page.locator('#emiamount span').textContent()
    const emiTotalInterest = await this.page.locator('#emitotalinterest span').textContent()
    const emiTotalAmount = await this.page.locator('#emitotalamount span').textContent()

    const emiCalculatorHelper = new EmiCalculatorHelper(homeLoanAmount, interestRate, loanTenureYears * 12)
    const expectedEmiAmount = emiCalculatorHelper.roundedEmiAmount()
    const expectedTotalAmount = emiCalculatorHelper.roundedTotalAmount()
    const expectedTotalInterest = emiCalculatorHelper.roundedTotalInterest()

    // I'm validating against calculcated values, only because of task requriements.
    // Otherwise I would validate against verified hard-coded values for readability.
    expect(emiAmount).toEqual(expectedEmiAmount.toLocaleString('hi-IN'))
    expect(emiTotalInterest).toEqual(expectedTotalInterest.toLocaleString('hi-IN'))
    expect(emiTotalAmount).toEqual(expectedTotalAmount.toLocaleString('hi-IN'))
  }

  async validatePieChartPercentages(homeLoanAmount: number, interestRate: number, loanTenureYears: number) {
    const emiPieChart = this.page.locator('#emipiechart')
    await emiPieChart.scrollIntoViewIfNeeded()

    const principalAmountPercentage = await this.page.locator('.highcharts-data-label-color-0 tspan').textContent()
    const totalInterestPercentage = await this.page.locator('.highcharts-data-label-color-1 tspan').textContent()
    
    const emiCalculatorHelper = new EmiCalculatorHelper(homeLoanAmount, interestRate, loanTenureYears * 12)
    const expectedTotalInterestPercentage = emiCalculatorHelper.roundedTotalInterestPercentage()
    const expectedPrincipalAmountPercentage = emiCalculatorHelper.roundedPrincipalAmountPercentage()

    // I'm validating against calculcated values, only because of task requriements.
    // Otherwise I would validate against verified hard-coded values for readability.
    expect(totalInterestPercentage).toEqual(expectedTotalInterestPercentage)
    expect(principalAmountPercentage).toEqual(expectedPrincipalAmountPercentage)
  }
}
