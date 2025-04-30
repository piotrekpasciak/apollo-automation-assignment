import { Page } from '@playwright/test'

export class LandingPageObject {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async acceptUserDataConstentModal() {
    const dialogContainer = this.page.locator('.fc-dialog-container')
    const consentButton = dialogContainer.getByRole('button', { name: 'Consent' })

    await consentButton.click()
  }
}
