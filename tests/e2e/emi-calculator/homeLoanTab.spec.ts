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

      await emiCalculatorObject.validatePaymentsBrakeUpAndPieChart('Home Loan', 2500000, 10, 10)
    })
  })

  test.describe('Pie Chart with ₹50L home loan amount, 7.5% interest rate and 15 years tenure', () => {
    test('displays brake-up of total payment and correct percentages in Pie Chart', async ({ page }) => { 
      const emiCalculatorObject = new EmiCalculatorObject(page)

      await emiCalculatorObject.validatePaymentsBrakeUpAndPieChart('Home Loan', 2500000, 10, 10)
    })
  })
})
