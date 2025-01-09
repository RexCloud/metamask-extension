import { Driver } from '../../../webdriver/driver';

class SolanaTxresultPage {
  private driver: Driver;

  private readonly closeButton = {
    text: 'Close',
    tag: 'span',
  };

  private readonly viewTransactionLink = {
    text: 'View transaction',
    tag: 'span',
  };

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async isViewTransactionLinkDisplayed() {
    try {
      await this.driver.findClickableElement(this.viewTransactionLink);
      return true;
    } catch (err) {
      console.log('View transaction link not displayed');
      return false;
    }
  }

  async checkTransactionStatus(sent: boolean): Promise<boolean> {
    const statusText = sent ? 'Sent' : 'Transaction failed';
    try {
      await this.driver.findElement({
        text: statusText,
        tag: 'h2',
      });
      return true;
    } catch (err) {
      console.log('Transaction status incorrect');
      return false;
    }
  }

  async checkTransactionStatusText(
    amount: string,
    sent: boolean,
  ): Promise<boolean> {
    const displayedText = sent
      ? `${amount} SOL was successfully sent`
      : `Unable to send ${amount} SOL`;
    const txStatusText = {
      text: displayedText,
      tag: 'p',
    };
    try {
      await this.driver.waitForSelector(
        txStatusText,
        { timeout: 5000 }, // even the tx is being mock, there is an spinner that sometimes is slow to disappear
      );
      await this.driver.findElement(txStatusText);
      return true;
    } catch (err) {
      console.log(
        `Transaction status text incorrect, expected ${displayedText} did not match`,
      );
      return false;
    }
  }

  async isTrancsactionDetailDisplayed(text: string): Promise<boolean> {
    const detail = await this.driver.findElement(
      {
        text,
        tag: 'p',
      },
      200,
    );
    return await detail.isDisplayed();
  }

  async clickOnClose(): Promise<void> {
    await this.driver.clickElement(this.closeButton);
  }
}

export default SolanaTxresultPage;
