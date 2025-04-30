import { test } from '@playwright/test'
import { LandingPageObject } from '../../../page-objects/landingPageObject'
import { EmiCalculatorObject } from '../../../page-objects/emiCalculatorObject'

test.describe('EMI Calculator Home Loan tab', () => {
  test.beforeEach(async ({ page }) => {
    const landingPageObject = new LandingPageObject(page)

    await page.goto('https://emicalculator.net/')
    await landingPageObject.acceptUserDataConstentModal()
  })

  test.describe('Pie Chart with ₹25L home loan amount, 10% interest rate and 10 years tenure', () => {
    test('displays brake-up of total payment and correct percentages in Pie Chart', async ({ page }) => { 
      const emiCalculatorObject = new EmiCalculatorObject(page)
      const homeLoanAmount = 2500000
      const interestRate = 10
      const loanTenureInYears = 10

      await emiCalculatorObject.openCalculatorTab('Home Loan')
      await emiCalculatorObject.fillEmiCalculatorForm(homeLoanAmount, interestRate, loanTenureInYears)
      await emiCalculatorObject.validateEmiPaymentsSummary(homeLoanAmount, interestRate, loanTenureInYears)
      await emiCalculatorObject.validatePieChartPercentages(homeLoanAmount, interestRate, loanTenureInYears)
    })
  })

  test.describe('Pie Chart with ₹50L home loan amount, 7.5% interest rate and 15 years tenure', () => {
    test('displays brake-up of total payment and correct percentages in Pie Chart', async ({ page }) => { 
      const emiCalculatorObject = new EmiCalculatorObject(page)
      const homeLoanAmount = 5000000
      const interestRate = 7.5
      const loanTenureInYears = 15

      await emiCalculatorObject.openCalculatorTab('Home Loan')
      await emiCalculatorObject.fillEmiCalculatorForm(homeLoanAmount, interestRate, loanTenureInYears)
      await emiCalculatorObject.validateEmiPaymentsSummary(homeLoanAmount, interestRate, loanTenureInYears)
      await emiCalculatorObject.validatePieChartPercentages(homeLoanAmount, interestRate, loanTenureInYears)
    })
  })
})
