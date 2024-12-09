const path = require('path');
const { execSync } = require('child_process');

const searchResults = [
  './.storybook/test-data.js',
  './app/scripts/ui.js',
  './shared/lib/error-utils.test.js',
  './shared/modules/selectors/feature-flags.ts',
  './shared/modules/selectors/index.test.ts',
  './shared/modules/selectors/smart-transactions.ts',
  './test/data/confirmations/helper.ts',
  './test/e2e/tests/request-queuing/ui.spec.js',
  './test/jest/mock-store.js',
  './test/jest/mocks.ts',
  './ui/components/app/alerts/unconnected-account-alert/unconnected-account-alert.test.js',
  './ui/components/app/assets/asset-list/asset-list.ramps-card.test.js',
  './ui/components/app/assets/asset-list/asset-list.test.tsx',
  './ui/components/app/assets/nfts/nft-details/nft-details.test.js',
  './ui/components/app/assets/nfts/nfts-items/nfts-items.stories.tsx',
  './ui/components/app/assets/nfts/nfts-tab/nfts-tab.test.js',
  './ui/components/app/assets/token-cell/token-cell.test.tsx',
  './ui/components/app/beta-header/beta-header.stories.js',
  './ui/components/app/cancel-speedup-popover/cancel-speedup-popover.stories.js',
  './ui/components/app/cancel-speedup-popover/cancel-speedup-popover.test.js',
  './ui/components/app/confirm/info/row/address.test.tsx',
  './ui/components/app/confirm/info/row/currency.stories.tsx',
  './ui/components/app/confirm/info/row/alert-row/alert-row.stories.tsx',
  './ui/components/app/create-new-vault/create-new-vault.test.js',
  './ui/components/app/currency-input/currency-input.test.js',
  './ui/components/app/currency-input/hooks/useTokenExchangeRate.test.tsx',
  './ui/components/app/detected-token/detected-token.test.js',
  './ui/components/app/detected-token/detected-token-selection-popover/detected-token-selection-popover.stories.js',
  './ui/components/app/detected-token/detected-token-values/detected-token-values.stories.js',
  './ui/components/app/modals/cancel-transaction/cancel-transaction-gas-fee/cancel-transaction-gas-fee.component.test.js',
  './ui/components/app/modals/confirm-remove-account/confirm-remove-account.test.js',
  './ui/components/app/modals/convert-token-to-nft-modal/convert-token-to-nft-modal.stories.tsx',
  './ui/components/app/modals/hide-token-confirmation-modal/hide-token-confirmation-modal.test.js',
  './ui/components/app/modals/new-account-modal/new-account-modal.test.tsx',
  './ui/components/app/modals/nickname-popovers/nickname-popovers.component.test.tsx',
  './ui/components/app/multi-rpc-edit-modal/multi-rpc-edit-modal.test.tsx',
  './ui/components/app/name/name.stories.tsx',
  './ui/components/app/name/name.test.tsx',
  './ui/components/app/name/name-details/name-details.test.tsx',
  './ui/components/app/snaps/snap-permission-adapter/snap-permission-adapter.test.js',
  './ui/components/app/snaps/snap-permissions-list/snap-permissions-list.test.js',
  './ui/components/app/snaps/snap-ui-address/snap-ui-address.test.tsx',
  './ui/components/app/srp-quiz-modal/SRPQuiz/SRPQuiz.test.js',
  './ui/components/app/terms-of-use-popup/terms-of-use-popup.test.js',
  './ui/components/app/toast-master/selectors.ts',
  './ui/components/app/toast-master/toast-master.test.ts',
  './ui/components/app/transaction-activity-log/transaction-activity-log.container.test.js',
  './ui/components/app/transaction-breakdown/transaction-breakdown.test.js',
  './ui/components/app/transaction-list/transaction-list.test.js',
  './ui/components/app/transaction-status-label/transaction-status-label.test.js',
  './ui/components/app/user-preferenced-currency-display/user-preferenced-currency-display.test.js',
  './ui/components/app/wallet-overview/eth-overview.test.js',
  './ui/components/app/wallet-overview/non-evm-overview.test.tsx',
  './ui/components/app/whats-new-popup/whats-new-popup.test.js',
  './ui/components/institutional/custody-confirm-link-modal/custody-confirm-link-modal.stories.tsx',
  './ui/components/institutional/custody-confirm-link-modal/custody-confirm-link-modal.test.tsx',
  './ui/components/institutional/interactive-replacement-token-modal/interactive-replacement-token-modal.stories.tsx',
  './ui/components/institutional/interactive-replacement-token-modal/interactive-replacement-token-modal.test.tsx',
  './ui/components/institutional/interactive-replacement-token-modal/interactive-replacement-token-modal.tsx',
  './ui/components/institutional/interactive-replacement-token-notification/interactive-replacement-token-notification.stories.tsx',
  './ui/components/institutional/interactive-replacement-token-notification/interactive-replacement-token-notification.test.tsx',
  './ui/components/institutional/qr-code-modal/qr-code-modal.stories.tsx',
  './ui/components/institutional/qr-code-modal/qr-code-modal.test.tsx',
  './ui/components/institutional/signature-mismatch-banner/signature-mismatch-banner.stories.tsx',
  './ui/components/institutional/signature-mismatch-banner/signature-mismatch-banner.test.tsx',
  './ui/components/institutional/wrong-network-notification/wrong-network-notification.stories.tsx',
  './ui/components/institutional/wrong-network-notification/wrong-network-notification.test.tsx',
  './ui/components/multichain/account-details/account-details.test.js',
  './ui/components/multichain/account-list-item/account-list-item.test.js',
  './ui/components/multichain/account-list-item-menu/account-list-item-menu.test.js',
  './ui/components/multichain/account-list-menu/account-list-menu.test.tsx',
  './ui/components/multichain/account-overview/account-overview-eth.test.tsx',
  './ui/components/multichain/account-overview/account-overview-non-evm.test.tsx',
  './ui/components/multichain/account-picker/account-picker.test.js',
  './ui/components/multichain/app-header/app-header.stories.js',
  './ui/components/multichain/app-header/app-header.test.js',
  './ui/components/multichain/asset-picker-amount/asset-picker-amount.stories.tsx',
  './ui/components/multichain/asset-picker-amount/utils.test.ts',
  './ui/components/multichain/asset-picker-amount/asset-balance/asset-balance-text.test.tsx',
  './ui/components/multichain/asset-picker-amount/asset-picker/asset-picker.test.tsx',
  './ui/components/multichain/asset-picker-amount/nft-input/nft-input.test.tsx',
  './ui/components/multichain/asset-picker-amount/swappable-currency-input/swappable-currency-input.test.tsx',
  './ui/components/multichain/badge-status/badge-status.test.js',
  './ui/components/multichain/connect-accounts-modal/connect-accounts-modal-list.test.tsx',
  './ui/components/multichain/connect-accounts-modal/connect-accounts-modal.test.tsx',
  './ui/components/multichain/connected-accounts-menu/connected-accounts-menu.test.tsx',
  './ui/components/multichain/connected-site-menu/connected-site-menu.test.js',
  './ui/components/multichain/create-named-snap-account/create-named-snap-account.test.tsx',
  './ui/components/multichain/detected-token-banner/detected-token-banner.stories.js',
  './ui/components/multichain/detected-token-banner/detected-token-banner.test.js',
  './ui/components/multichain/edit-accounts-modal/edit-accounts-modal.test.tsx',
  './ui/components/multichain/edit-networks-modal/edit-networks-modal.test.js',
  './ui/components/multichain/global-menu/global-menu.test.js',
  './ui/components/multichain/import-nfts-modal/import-nfts-modal.stories.js',
  './ui/components/multichain/import-tokens-modal/import-tokens-modal-confirm.stories.js',
  './ui/components/multichain/import-tokens-modal/import-tokens-modal.stories.js',
  './ui/components/multichain/import-tokens-modal/import-tokens-modal.test.js',
  './ui/components/multichain/menu-items/view-explorer-menu-item.test.tsx',
  './ui/components/multichain/network-list-menu/network-list-menu.stories.js',
  './ui/components/multichain/network-list-menu/network-list-menu.test.js',
  './ui/components/multichain/network-list-menu/popular-network-list/PopularNetworkList.stories.js',
  './ui/components/multichain/network-list-menu/select-rpc-url-modal/select-rpc-url-modal.test.tsx',
  './ui/components/multichain/nft-item/nft-item.test.js',
  './ui/components/multichain/notification-detail-collection/notification-detail-collection.test.tsx',
  './ui/components/multichain/notifications-page/notifications-page.test.tsx',
  './ui/components/multichain/notifications-settings-box/notifications-settings-box.test.tsx',
  './ui/components/multichain/pages/connections/connections.test.tsx',
  './ui/components/multichain/pages/permissions-page/permissions-page.test.js',
  './ui/components/multichain/pages/review-permissions-page/review-permissions-page.test.tsx',
  './ui/components/multichain/pages/review-permissions-page/site-cell/site-cell-tooltip.test.js',
  './ui/components/multichain/pages/send/send.test.js',
  './ui/components/multichain/pages/send/components/account-picker.test.tsx',
  './ui/components/multichain/pages/send/components/recipient.test.tsx',
  './ui/components/multichain/pages/send/components/your-accounts.test.tsx',
  './ui/components/multichain/permission-details-modal/permission-details-modal.test.tsx',
  './ui/components/multichain/token-list-item/token-list-item.stories.js',
  './ui/components/multichain/token-list-item/token-list-item.test.tsx',
  './ui/components/multichain/token-list-item/price/percentage-and-amount-change/percentage-and-amount-change.stories.js',
  './ui/components/multichain/token-list-item/price/percentage-change/percentage-change.stories.js',
  './ui/components/ui/account-list/account-list.test.js',
  './ui/components/ui/deprecated-networks/deprecated-networks.stories.js',
  './ui/components/ui/identicon/identicon.component.test.js',
  './ui/components/ui/identicon/identicon.container.js',
  './ui/components/ui/new-network-info/new-network-info.test.js',
  './ui/components/ui/nickname-popover/nickname-popover.test.js',
  './ui/components/ui/qr-code-view/qr-code-view.test.tsx',
  './ui/components/ui/survey-toast/survey-toast.test.tsx',
  './ui/components/ui/token-input/token-input.component.test.js',
  './ui/components/ui/token-input/token-input.container.js',
  './ui/components/ui/update-nickname-popover/update-nickname-popover.test.js',
  './ui/ducks/bridge/selectors.test.ts',
  './ui/ducks/bridge/selectors.ts',
  './ui/ducks/bridge-status/selectors.ts',
  './ui/ducks/confirm-transaction/confirm-transaction.duck.test.js',
  './ui/ducks/institutional/institutional.test.ts',
  './ui/ducks/institutional/institutional.ts',
  './ui/ducks/metamask/metamask.test.js',
  './ui/ducks/metamask/metamask.ts',
  './ui/ducks/send/send.js',
  './ui/ducks/send/send.test.js',
  './ui/ducks/swaps/swaps.test.js',
  './ui/helpers/higher-order-components/authenticated/authenticated.container.js',
  './ui/helpers/higher-order-components/initialized/initialized.container.js',
  './ui/helpers/utils/tags.test.ts',
  './ui/hooks/useAccountTotalFiatBalance.test.js',
  './ui/hooks/useAccountTrackerPolling.test.ts',
  './ui/hooks/useAddressDetails.test.js',
  './ui/hooks/useAssetDetails.test.js',
  './ui/hooks/useCurrencyDisplay.test.js',
  './ui/hooks/useCurrencyRatePolling.test.ts',
  './ui/hooks/useEventFragment.test.js',
  './ui/hooks/useIsOriginalTokenSymbol.test.js',
  './ui/hooks/useMMIConfirmations.test.ts',
  './ui/hooks/useMultichainAccountTotalFiatBalance.test.tsx',
  './ui/hooks/useMultichainSelector.test.ts',
  './ui/hooks/usePetnamesEnabled.test.ts',
  './ui/hooks/useTheme.test.ts',
  './ui/hooks/useTokenDetectionPolling.test.ts',
  './ui/hooks/useTokenListPolling.test.ts',
  './ui/hooks/useTokenRatesPolling.test.ts',
  './ui/hooks/useTransactionDisplayData.test.js',
  './ui/hooks/useUserPreferencedCurrency.test.js',
  './ui/hooks/bridge/useBridging.test.ts',
  './ui/hooks/identity/useMetametrics.test.tsx',
  './ui/hooks/identity/useProfileSyncing/profileSyncing.test.tsx',
  './ui/hooks/metamask-notifications/useCounter.test.tsx',
  './ui/hooks/metamask-notifications/useNotifications.test.tsx',
  './ui/hooks/metamask-notifications/useSwitchNotifications.test.tsx',
  './ui/hooks/ramps/useRamps/useRamps.test.tsx',
  './ui/pages/asset/components/asset-page.test.tsx',
  './ui/pages/confirm-add-suggested-nft/confirm-add-suggested-nft.stories.js',
  './ui/pages/confirm-add-suggested-nft/confirm-add-suggested-nft.test.js',
  './ui/pages/confirm-add-suggested-token/confirm-add-suggested-token.stories.js',
  './ui/pages/confirm-add-suggested-token/confirm-add-suggested-token.test.js',
  './ui/pages/confirm-decrypt-message/confirm-decrypt-message.component.test.js',
  './ui/pages/confirm-encryption-public-key/confirm-encryption-public-key.container.js',
  './ui/pages/confirmations/components/advanced-gas-fee-popover/advanced-gas-fee-popover.test.js',
  './ui/pages/confirmations/components/advanced-gas-fee-popover/advanced-gas-fee-defaults/advanced-gas-fee-defaults.stories.js',
  './ui/pages/confirmations/components/advanced-gas-fee-popover/advanced-gas-fee-defaults/advanced-gas-fee-defaults.test.js',
  './ui/pages/confirmations/components/advanced-gas-fee-popover/advanced-gas-fee-gas-limit/advanced-gas-fee-gas-limit.test.js',
  './ui/pages/confirmations/components/advanced-gas-fee-popover/advanced-gas-fee-inputs/base-fee-input/base-fee-input.test.js',
  './ui/pages/confirmations/components/advanced-gas-fee-popover/advanced-gas-fee-inputs/priority-fee-input/priority-fee-input.test.js',
  './ui/pages/confirmations/components/confirm/blockaid-loading-indicator/blockaid-loading-indicator.test.tsx',
  './ui/pages/confirmations/components/confirm/footer/footer.test.tsx',
  './ui/pages/confirmations/components/confirm/info/hooks/useFourByte.test.ts',
  './ui/pages/confirmations/components/confirm/info/personal-sign/personal-sign.test.tsx',
  './ui/pages/confirmations/components/confirm/info/set-approval-for-all-info/set-approval-for-all-info.test.tsx',
  './ui/pages/confirmations/components/confirm/info/shared/advanced-details/advanced-details.test.tsx',
  './ui/pages/confirmations/components/confirm/info/shared/transaction-data/transaction-data.stories.tsx',
  './ui/pages/confirmations/components/confirm/info/shared/transaction-details/transaction-details.stories.tsx',
  './ui/pages/confirmations/components/confirm/info/typed-sign/typed-sign.test.tsx',
  './ui/pages/confirmations/components/confirm/info/typed-sign/typed-sign-v4-simulation/typed-sign-v4-simulation.test.tsx',
  './ui/pages/confirmations/components/confirm/ledger-info/ledger-info.stories.tsx',
  './ui/pages/confirmations/components/confirm/ledger-info/ledger-info.test.tsx',
  './ui/pages/confirmations/components/confirm/nav/nav.stories.tsx',
  './ui/pages/confirmations/components/confirm/nav/nav.test.tsx',
  './ui/pages/confirmations/components/confirm/network-change-toast/network-change-toast-legacy.test.tsx',
  './ui/pages/confirmations/components/confirm/snaps/snaps-section/snaps-section.test.tsx',
  './ui/pages/confirmations/components/confirm-gas-display/confirm-gas-display.test.js',
  './ui/pages/confirmations/components/confirm-gas-display/confirm-legacy-gas-display/confirm-legacy-gas-display.test.js',
  './ui/pages/confirmations/components/confirm-hexdata/confirm-hexdata.test.js',
  './ui/pages/confirmations/components/confirm-page-container/confirm-detail-row/confirm-detail-row.component.test.js',
  './ui/pages/confirmations/components/confirm-page-container/confirm-page-container-content/confirm-page-container-content.component.test.js',
  './ui/pages/confirmations/components/confirm-page-container/confirm-page-container-header/confirm-page-container-header.component.test.js',
  './ui/pages/confirmations/components/edit-gas-fee-button/edit-gas-fee-button.test.js',
  './ui/pages/confirmations/components/edit-gas-fee-icon/edit-gas-fee-icon.test.js',
  './ui/pages/confirmations/components/edit-gas-fee-popover/edit-gas-fee-popover.test.js',
  './ui/pages/confirmations/components/edit-gas-fee-popover/edit-gas-item/edit-gas-item.test.js',
  './ui/pages/confirmations/components/edit-gas-fee-popover/edit-gas-tooltip/edit-gas-tooltip.test.js',
  './ui/pages/confirmations/components/fee-details-component/fee-details-component.test.js',
  './ui/pages/confirmations/components/gas-details-item/gas-details-item.test.js',
  './ui/pages/confirmations/components/gas-timing/gas-timing.component.test.js',
  './ui/pages/confirmations/components/gas-timing/gas-timing.stories.tsx',
  './ui/pages/confirmations/components/ledger-instruction-field/ledger-instruction-field.test.js',
  './ui/pages/confirmations/components/multilayer-fee-message/multi-layer-fee-message.test.js',
  './ui/pages/confirmations/components/security-provider-banner-alert/blockaid-banner-alert/blockaid-banner-alert.test.js',
  './ui/pages/confirmations/components/signature-request/signature-request.stories.js',
  './ui/pages/confirmations/components/signature-request/signature-request.test.js',
  './ui/pages/confirmations/components/signature-request/signature-request-data/signature-request-data.test.js',
  './ui/pages/confirmations/components/signature-request-header/signature-request-header.stories.js',
  './ui/pages/confirmations/components/signature-request-original/signature-request-original.stories.js',
  './ui/pages/confirmations/components/signature-request-original/signature-request-original.test.js',
  './ui/pages/confirmations/components/signature-request-siwe/signature-request-siwe.stories.js',
  './ui/pages/confirmations/components/signature-request-siwe/signature-request-siwe.test.js',
  './ui/pages/confirmations/components/simulation-details/asset-pill.test.tsx',
  './ui/pages/confirmations/components/simulation-details/fiat-display.test.tsx',
  './ui/pages/confirmations/components/simulation-details/simulation-details.stories.tsx',
  './ui/pages/confirmations/components/snap-account-error-message/SnapAccountErrorMessage.test.tsx',
  './ui/pages/confirmations/components/transaction-alerts/transaction-alerts.stories.js',
  './ui/pages/confirmations/components/transaction-alerts/transaction-alerts.test.js',
  './ui/pages/confirmations/components/transaction-detail/transaction-detail.component.test.js',
  './ui/pages/confirmations/confirm/confirm.test.tsx',
  './ui/pages/confirmations/confirm/stories/utils.tsx',
  './ui/pages/confirmations/confirm/stories/transactions/contract-interaction.stories.tsx',
  './ui/pages/confirmations/confirm-approve/confirm-approve-content/confirm-approve-content.component.test.js',
  './ui/pages/confirmations/confirm-signature-request/index.test.js',
  './ui/pages/confirmations/confirm-transaction/confirm-transaction.test.js',
  './ui/pages/confirmations/confirm-transaction-base/confirm-transaction-base.test.js',
  './ui/pages/confirmations/confirmation/stories/util.js',
  './ui/pages/confirmations/confirmation/templates/add-ethereum-chain.test.js',
  './ui/pages/confirmations/confirmation/templates/create-named-snap-account.test.js',
  './ui/pages/confirmations/confirmation/templates/create-snap-account.test.js',
  './ui/pages/confirmations/confirmation/templates/error.test.js',
  './ui/pages/confirmations/confirmation/templates/remove-snap-account.test.js',
  './ui/pages/confirmations/confirmation/templates/snap-account-redirect.test.js',
  './ui/pages/confirmations/confirmation/templates/success.test.js',
  './ui/pages/confirmations/confirmation/templates/switch-ethereum-chain.test.js',
  './ui/pages/confirmations/hooks/useBalance.test.js',
  './ui/pages/confirmations/hooks/useConfirmationNetworkInfo.test.ts',
  './ui/pages/confirmations/hooks/useCurrentConfirmation.test.ts',
  './ui/pages/confirmations/hooks/useCurrentSignatureSecurityAlertResponse.test.ts',
  './ui/pages/confirmations/hooks/useCurrentSignatureSecurityAlertResponse.ts',
  './ui/pages/confirmations/hooks/useSmartTransactionFeatureFlags.test.ts',
  './ui/pages/confirmations/hooks/useTransactionFunctionType.test.js',
  './ui/pages/confirmations/hooks/useTypesSignSimulationEnabledInfo.test.ts',
  './ui/pages/confirmations/hooks/alerts/useBlockaidAlerts.test.ts',
  './ui/pages/confirmations/hooks/alerts/useBlockaidAlerts.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/useFirstTimeInteractionAlert.test.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/useGasFeeLowAlerts.test.tsx',
  './ui/pages/confirmations/hooks/alerts/transactions/useInsufficientBalanceAlerts.test.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/useNetworkBusyAlerts.test.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/useNoGasPriceAlerts.test.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/usePendingTransactionAlerts.test.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/useResimulationAlert.test.ts',
  './ui/pages/confirmations/hooks/alerts/transactions/useSigningOrSubmittingAlerts.test.ts',
  './ui/pages/confirmations/selectors/confirm.test.ts',
  './ui/pages/confirmations/selectors/preferences.test.ts',
  './ui/pages/confirmations/selectors/preferences.ts',
  './ui/pages/confirmations/token-allowance/token-allowance.stories.js',
  './ui/pages/confirmations/token-allowance/token-allowance.test.js',
  './ui/pages/confirmations/types/confirm.ts',
  './ui/pages/create-account/connect-hardware/account-list.test.js',
  './ui/pages/create-account/connect-hardware/index.test.tsx',
  './ui/pages/institutional/confirm-add-custodian-token/confirm-add-custodian-token.stories.tsx',
  './ui/pages/institutional/confirm-add-custodian-token/confirm-add-custodian-token.test.tsx',
  './ui/pages/institutional/confirm-connect-custodian-modal/confirm-connect-custodian-modal.test.tsx',
  './ui/pages/institutional/custody/custody.stories.tsx',
  './ui/pages/institutional/custody/custody.test.tsx',
  './ui/pages/institutional/interactive-replacement-token-page/interactive-replacement-token-page.stories.tsx',
  './ui/pages/institutional/interactive-replacement-token-page/interactive-replacement-token-page.test.tsx',
  './ui/pages/institutional/interactive-replacement-token-page/interactive-replacement-token-page.tsx',
  './ui/pages/institutional/remind-srp/remind-srp.test.tsx',
  './ui/pages/keychains/restore-vault.test.js',
  './ui/pages/lock/lock.container.js',
  './ui/pages/notifications/notifications-list-read-all-button.test.tsx',
  './ui/pages/notifications/notifications-list-turn-on-notifications.test.tsx',
  './ui/pages/notifications/notifications-list.test.tsx',
  './ui/pages/notifications/notifications.test.tsx',
  './ui/pages/notifications-settings/notifications-settings-allow-notifications.test.tsx',
  './ui/pages/onboarding-flow/onboarding-flow.test.js',
  './ui/pages/onboarding-flow/create-password/create-password.test.js',
  './ui/pages/onboarding-flow/creation-successful/creation-successful.test.js',
  './ui/pages/onboarding-flow/import-srp/import-srp.test.js',
  './ui/pages/onboarding-flow/metametrics/metametrics.test.js',
  './ui/pages/onboarding-flow/onboarding-flow-switch/onboarding-flow-switch.test.js',
  './ui/pages/onboarding-flow/pin-extension/pin-extension.test.js',
  './ui/pages/onboarding-flow/privacy-settings/privacy-settings.test.js',
  './ui/pages/onboarding-flow/welcome/welcome.test.js',
  './ui/pages/permissions-connect/connect-page/connect-page.test.tsx',
  './ui/pages/routes/routes.component.test.js',
  './ui/pages/settings/settings.container.js',
  './ui/pages/settings/contact-list-tab/add-contact/add-contact.test.js',
  './ui/pages/settings/experimental-tab/experimental-tab.test.js',
  './ui/pages/settings/networks-tab/networks-form/networks-form.test.js',
  './ui/pages/settings/security-tab/metametrics-toggle/metametrics-toggle.test.tsx',
  './ui/pages/settings/security-tab/profile-sync-toggle/profile-sync-toggle.test.tsx',
  './ui/pages/smart-transactions/smart-transaction-status-page/smart-transaction-status-page.stories.tsx',
  './ui/pages/snap-account-redirect/create-snap-redirect.test.tsx',
  './ui/pages/swaps/prepare-swap-page/prepare-swap-page.test.js',
  './ui/pages/swaps/prepare-swap-page/view-quote-price-difference.test.js',
  './ui/pages/unlock-page/unlock-page.container.js',
  './ui/selectors/account-abstraction.test.ts',
  './ui/selectors/accounts.test.ts',
  './ui/selectors/approvals.test.ts',
  './ui/selectors/approvals.ts',
  './ui/selectors/confirm-transaction.test.js',
  './ui/selectors/custom-gas.test.js',
  './ui/selectors/metametrics.test.js',
  './ui/selectors/multichain.test.ts',
  './ui/selectors/networks.test.ts',
  './ui/selectors/nft.test.ts',
  './ui/selectors/nft.ts',
  './ui/selectors/nonce-sorted-transactions-selector.test.js',
  './ui/selectors/permissions.js',
  './ui/selectors/permissions.test.js',
  './ui/selectors/selectors.test.js',
  './ui/selectors/transactions.test.js',
  './ui/selectors/identity/authentication.test.ts',
  './ui/selectors/identity/profile-syncing.test.ts',
  './ui/selectors/institutional/selectors.test.ts',
  './ui/selectors/metamask-notifications/metamask-notifications.test.ts',
  './ui/selectors/snaps/address-book.ts',
  './ui/store/actionConstants.test.js',
  './ui/store/actions.test.js',
  './ui/store/institutional/institution-actions.test.js',
];

const transformScripts = {
  '.js':
    'node ./development/unflatten-redux-state/unflattenMetamaskSliceJavaScript.js',
  '.jsx':
    'node ./development/unflatten-redux-state/unflattenMetamaskSliceJavaScript.js',
  '.ts':
    'yarn ts-node ./development/unflatten-redux-state/unflattenMetamaskSliceTypeScript.ts',
  '.tsx':
    'yarn ts-node ./development/unflatten-redux-state/unflattenMetamaskSliceTypeScript.ts',
};

searchResults.forEach((filePath) => {
  const ext = path.extname(filePath);
  const transformScript = transformScripts[ext];

  if (transformScript) {
    try {
      execSync(`${transformScript} ${filePath}`, { stdio: 'inherit' });
      console.log(`Transformed: ${filePath}`);
    } catch (error) {
      console.error(`Error transforming ${filePath}:`, error);
    }
  } else {
    console.warn(`No transform script for file type: ${ext}`);
  }
});
