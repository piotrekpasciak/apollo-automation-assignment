import { test, expect } from '@playwright/test'
import { LandingPageObject } from '../../../page-objects/landingPageObject'
import { EmiCalculatorObject } from '../../../page-objects/emiCalculatorObject'
import { EmiCalculatorHelper } from '../../../helpers/emiCalculatorHelper'

test.describe('EMI Calculator Personal Loan tab', () => {
  test.beforeEach(async ({ page }) => {
    const landingPageObject = new LandingPageObject(page)

    await page.goto('https://emicalculator.net/')
    await landingPageObject.acceptUserDataConstentModal()
  })

  test.describe('Bar Chart with ₹10L personal loan amount, 12% interest rate and 5 years tenure', () => {
    test('displays Bar Chart with 5 bars and correct yearly breakdown in tooltips', async ({ page }) => { 
      const emiCalculatorObject = new EmiCalculatorObject(page)
      const personalLoanAmount = 1000000
      const interestRate = 12
      const loanTenureInYears = 5
      const emiCalculatorHelper = new EmiCalculatorHelper(personalLoanAmount, interestRate, loanTenureInYears * 12)
  
      await emiCalculatorObject.openCalculatorTab('Personal Loan')

      const emiCalculatorForm = page.locator('#emicalculatorform')
      const loanAmountSlider = emiCalculatorForm.locator('#loanamountslider')
      const personalLoanAmountInput = emiCalculatorForm.getByLabel('Personal Loan Amount')
      
      await emiCalculatorObject.slideToValue(loanAmountSlider, personalLoanAmount, 0, 3000000)   
      await expect(personalLoanAmountInput).toHaveValue(personalLoanAmount.toLocaleString('hi-IN'))   

      const interestRateSlider = emiCalculatorForm.locator('#loaninterestslider')
      const interestRatetInput = emiCalculatorForm.getByLabel('Interest Rate')

      await emiCalculatorObject.slideToValue(interestRateSlider, interestRate, 5, 25)      
      await expect(interestRatetInput).toHaveValue(String(interestRate))   

      const loanTenureSlider = emiCalculatorForm.locator('#loantermslider')
      const loanTenuretInput = emiCalculatorForm.getByLabel('Loan Tenure')

      await emiCalculatorObject.slideToValue(loanTenureSlider, loanTenureInYears, 0, 5)
      await expect(loanTenuretInput).toHaveValue(String(loanTenureInYears))       

      // I'm aware that this will work a bit differently for other months, but I would like to focus
      // on other parts of home assingments.
      await emiCalculatorObject.setStartingFromMonth('Jan')

      const emiBarChart = page.locator('#emibarchart')
      // Locator has to be very precise, because elements in chart legend have similiar selector.
      // const allInterestBars = await emiBarChart.locator('g.highcharts-series-0.highcharts-tracker rect.highcharts-point').all()
      const interestBarsLocator = emiBarChart.locator('g.highcharts-series-0.highcharts-tracker rect.highcharts-point')
      const prrincipalBarsLocator = emiBarChart.locator('g.highcharts-series-1.highcharts-tracker rect.highcharts-point')

      expect(await interestBarsLocator.all()).toHaveLength(loanTenureInYears)
      expect(await prrincipalBarsLocator.all()).toHaveLength(loanTenureInYears)
      
      await emiCalculatorObject.validateBarChartTooltips(interestBarsLocator, 'Interest', loanTenureInYears, emiCalculatorHelper)
      await emiCalculatorObject.validateBarChartTooltips(prrincipalBarsLocator, 'Principal', loanTenureInYears, emiCalculatorHelper)
    })
  })
})
