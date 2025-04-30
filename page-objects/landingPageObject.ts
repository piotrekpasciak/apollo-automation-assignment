import { Page } from '@playwright/test'

export class LandingPageObject {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async acceptUserDataConstentModal() {
    const dialogContainer = this.page.locator('.fc-dialog-container')
    const consentButton = dialogContainer.getByRole('button', { name: 'Consent' })

    // For some reason Consent dialog doesn't appear when tests are run by Github Workflow.
    // If it would appear with delay specs would fail, because Playwright would
    // not be able to interact with page.
    try {
      await consentButton.waitFor({ timeout: 2000 })
      await consentButton.click()
    } catch (error) {}
  }
}
