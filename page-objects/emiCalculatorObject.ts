import { expect, Page, Locator } from '@playwright/test'
import { EmiCalculatorHelper } from '../helpers/emiCalculatorHelper'

export class EmiCalculatorObject {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async openCalculatorTab(tabName: string) {
    const emiCalculatorDashboard = this.page.locator('#emicalculatordashboard')
    const tabLink = emiCalculatorDashboard.getByRole('link', { name: tabName })

    await tabLink.click()
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

  // Check later for right place for this function
  async slideToValue(sliderLocator: Locator, targetValue: number, minValue: number, maxValue: number) {
    const sliderHandle = sliderLocator.locator('span.ui-slider-handle')

    await sliderHandle.scrollIntoViewIfNeeded()
    await sliderHandle.hover()

    const sliderBox = await sliderLocator.boundingBox()
    const mouseMoveX = (targetValue - minValue) / (maxValue - minValue) * sliderBox.width

    await this.page.mouse.down()
    await this.page.mouse.move(sliderBox.x + mouseMoveX, sliderBox.y)
    await this.page.mouse.up()
  }

  async setStartingFromMonth(monthName: string) {
    const startingFromInput = this.page.locator('#startmonthyear')
    await startingFromInput.click()

    const janButton = this.page.locator('.datepicker-months span.month').getByText(monthName, { exact: true })
    await janButton.click()

    // Wait for EMI Bar Chart update.
    await this.page.waitForTimeout(500)
  }

  async validateBarChartTooltips(barsLocator: Locator, barType: string, loanTenureInYears: number, emiCalculatorHelper: EmiCalculatorHelper) {
    const emiBarChart = this.page.locator('#emibarchart')
    const allBars = await barsLocator.all()
    const expectedYear = new Date().getFullYear()
    const expectedTotalAmountPerYear = emiCalculatorHelper.roundedTotalAmountPerYear(loanTenureInYears)

    for (let index = 0; index < allBars.length; index++) {
      const singleBar = allBars[index]
      
      await singleBar.scrollIntoViewIfNeeded()
      await singleBar.hover() 

      const barTooltip = emiBarChart.locator('.highcharts-tooltip')
      const yearLine = await barTooltip.locator('tspan').nth(0).textContent()
      const middleLine = await barTooltip.locator('tspan').nth(1).textContent()
      const totalPaymentLine = await barTooltip.locator('tspan').nth(2).textContent()

      expect(yearLine).toEqual(`Year : ${expectedYear + index}`)
      if (barType === 'Interest') {
        const expectedInterestAmountPerYear = emiCalculatorHelper.roundedInterestAmountPerYear(index + 1)
        expect(middleLine).toEqual(`Interest : ₹ ${expectedInterestAmountPerYear.toLocaleString('hi-IN')}`)
      } else if (barType == 'Principal') {
        const expectedPrincipalAmountPerYear = emiCalculatorHelper.roundedPrincipalAmountPerYear(index + 1)
        expect(middleLine).toEqual(`Principal : ₹ ${expectedPrincipalAmountPerYear.toLocaleString('hi-IN')}`)
      }
      
      expect(totalPaymentLine).toEqual(`Total Payment : ₹ ${expectedTotalAmountPerYear.toLocaleString('hi-IN')}`)
    }
  }
}
