import { Suite } from 'mocha';
import { strict as assert } from 'assert';
import HeaderNavbar from '../../page-objects/pages/header-navbar';
import AccountListPage from '../../page-objects/pages/account-list-page';
import { SOL_BALANCE, USD_BALANCE, withSolanaAccountSnap } from './common-solana';
import { logging } from 'selenium-webdriver';
import SettingsPage from '../../page-objects/pages/settings/settings-page';
import { ACCOUNT_TYPE } from '../../page-objects/common';
import HomePage from '../../page-objects/pages/home/homepage';
import SolanaHomepage from '../../page-objects/pages/home/solana-homepage';

const EXPECTED_MAINNET_BALANCE_USD = `$${USD_BALANCE}`;

describe('Switching between account from different networks', function (this: Suite) {
  this.timeout(120000)
  it.only('Switch from Solana account to another Network account', async function () {
    await withSolanaAccountSnap(
      { title: this.test?.fullTitle(),},
      async (driver) => {
        const headerNavbar = new HeaderNavbar(driver);
        await headerNavbar.check_pageIsLoaded();
        const homePage = new SolanaHomepage(driver)
        const balanceText = await homePage.getSolanaBalance()
        console.log('BalanceText ', balanceText)
        console.log('xpectedText ', "0 SOL")
        assert.equal(balanceText, "0 SOL");
      },
    );
  });
});
