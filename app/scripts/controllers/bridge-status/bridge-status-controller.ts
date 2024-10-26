import { StateMetadata } from '@metamask/base-controller';
import { StaticIntervalPollingController } from '@metamask/polling-controller';
import { Hex } from '@metamask/utils';
import { Numeric } from '../../../../shared/modules/Numeric';
import { QuoteResponse } from '../../../../ui/pages/bridge/types';
import {
  BRIDGE_STATUS_CONTROLLER_NAME,
  DEFAULT_BRIDGE_STATUS_CONTROLLER_STATE,
  REFRESH_INTERVAL_MS,
} from './constants';
import {
  BridgeStatusControllerState,
  BridgeStatusControllerMessenger,
  StatusRequest,
  StatusTypes,
  BridgeHistoryItem,
} from './types';
import { fetchBridgeTxStatus } from './utils';

const metadata: StateMetadata<{
  bridgeStatusState: BridgeStatusControllerState;
}> = {
  bridgeStatusState: {
    persist: true,
    anonymous: false,
  },
};

type SrcTxHash = string;
export type FetchBridgeTxStatusArgs = {
  statusRequest: StatusRequest;
  quoteResponse: QuoteResponse;
  startTime?: BridgeHistoryItem['startTime'];
  slippagePercentage: BridgeHistoryItem['slippagePercentage'];
  pricingData?: BridgeHistoryItem['pricingData'];
  initialDestAssetBalance?: BridgeHistoryItem['initialDestAssetBalance'];
  targetContractAddress?: BridgeHistoryItem['targetContractAddress'];
};

export default class BridgeStatusController extends StaticIntervalPollingController<
  typeof BRIDGE_STATUS_CONTROLLER_NAME,
  { bridgeStatusState: BridgeStatusControllerState },
  BridgeStatusControllerMessenger
> {
  #pollingTokensBySrcTxHash: Record<SrcTxHash, string> = {};

  constructor({ messenger }: { messenger: BridgeStatusControllerMessenger }) {
    super({
      name: BRIDGE_STATUS_CONTROLLER_NAME,
      metadata,
      messenger,
      state: { bridgeStatusState: DEFAULT_BRIDGE_STATUS_CONTROLLER_STATE },
    });

    // Register action handlers
    this.messagingSystem.registerActionHandler(
      `${BRIDGE_STATUS_CONTROLLER_NAME}:startPollingForBridgeTxStatus`,
      this.startPollingForBridgeTxStatus.bind(this),
    );
    this.messagingSystem.registerActionHandler(
      `${BRIDGE_STATUS_CONTROLLER_NAME}:wipeBridgeStatus`,
      this.wipeBridgeStatus.bind(this),
    );

    // Set interval
    this.setIntervalLength(REFRESH_INTERVAL_MS);
  }

  resetState = () => {
    this.update((_state) => {
      _state.bridgeStatusState = {
        ...DEFAULT_BRIDGE_STATUS_CONTROLLER_STATE,
      };
    });
  };

  wipeBridgeStatus = ({
    address,
    ignoreNetwork,
  }: {
    address: string;
    ignoreNetwork: boolean;
  }) => {
    // Wipe all networks for this address
    if (ignoreNetwork) {
      this.update((_state) => {
        _state.bridgeStatusState = {
          ...DEFAULT_BRIDGE_STATUS_CONTROLLER_STATE,
        };
      });
    } else {
      const { selectedNetworkClientId } = this.messagingSystem.call(
        'NetworkController:getState',
      );
      const selectedNetworkClient = this.messagingSystem.call(
        'NetworkController:getNetworkClientById',
        selectedNetworkClientId,
      );
      const selectedChainId = selectedNetworkClient.configuration.chainId;

      this.#wipeBridgeStatusByChainId(address, selectedChainId);
    }
  };

  startPollingForBridgeTxStatus = async (
    fetchBridgeTxStatusArgs: Omit<FetchBridgeTxStatusArgs, 'completionTime'>,
  ) => {
    console.log('startPollingForBridgeTxStatus', { fetchBridgeTxStatusArgs });
    const {
      statusRequest,
      quoteResponse,
      startTime,
      slippagePercentage,
      pricingData,
      initialDestAssetBalance,
      targetContractAddress,
    } = fetchBridgeTxStatusArgs;
    const hexSourceChainId = new Numeric(statusRequest.srcChainId, 10)
      .toPrefixedHexString()
      .toLowerCase() as `0x${string}`;

    const { bridgeStatusState } = this.state;
    const { address: account } = this.#getSelectedAccount();

    // Write all non-status fields to state so we can reference the quote in Activity list without the Bridge API
    // We know it's in progress but not the exact status yet
    this.update((_state) => {
      _state.bridgeStatusState = {
        ...bridgeStatusState,
        txHistory: {
          ...bridgeStatusState.txHistory,
          [statusRequest.srcTxHash]: {
            quote: quoteResponse.quote,
            startTime,
            estimatedProcessingTimeInSeconds:
              quoteResponse.estimatedProcessingTimeInSeconds,
            slippagePercentage,
            pricingData,
            initialDestAssetBalance,
            targetContractAddress,
            account,
          },
        },
      };
    });

    const networkClientId = this.messagingSystem.call(
      'NetworkController:findNetworkClientIdByChainId',
      hexSourceChainId,
    );
    this.#pollingTokensBySrcTxHash[statusRequest.srcTxHash] =
      this.startPollingByNetworkClientId(
        networkClientId,
        fetchBridgeTxStatusArgs,
      );
  };

  // This will be called after you call this.startPollingByNetworkClientId()
  _executePoll = async (
    _networkClientId: string,
    fetchBridgeTxStatusArgs: FetchBridgeTxStatusArgs,
  ) => {
    await this.#fetchBridgeTxStatus(fetchBridgeTxStatusArgs);
  };

  #getSelectedAccount() {
    return this.messagingSystem.call('AccountsController:getSelectedAccount');
  }

  #fetchBridgeTxStatus = async ({ statusRequest }: FetchBridgeTxStatusArgs) => {
    const { bridgeStatusState } = this.state;

    try {
      // We try here because we receive 500 errors from Bridge API if we try to fetch immediately after submitting the source tx
      // Oddly mostly happens on Optimism, never on Arbitrum. By the 2nd fetch, the Bridge API responds properly.
      const status = await fetchBridgeTxStatus(statusRequest);
      console.log('fetchBridgeTxStatus', {
        statusRequest,
        status,
      });

      // No need to purge these on network change or account change, TransactionController does not purge either.
      // TODO In theory we can skip checking status if it's not the current account/network
      // we need to keep track of the account that this is associated with as well so that we don't show it in Activity list for other accounts
      // First stab at this will not stop polling when you are on a different account
      this.update((_state) => {
        const bridgeHistoryItem =
          _state.bridgeStatusState.txHistory[statusRequest.srcTxHash];

        _state.bridgeStatusState = {
          ...bridgeStatusState,
          txHistory: {
            ...bridgeStatusState.txHistory,
            [statusRequest.srcTxHash]: {
              ...bridgeHistoryItem,
              status,
            },
          },
        };
      });

      const pollingToken =
        this.#pollingTokensBySrcTxHash[statusRequest.srcTxHash];
      if (status.status === StatusTypes.COMPLETE && pollingToken) {
        this.stopPollingByPollingToken(pollingToken);
      }
    } catch (e) {
      console.error(e);
    }
  };

  #wipeBridgeStatusByChainId = (address: string, selectedChainId: Hex) => {
    const sourceTxHashesToDelete = Object.keys(
      this.state.bridgeStatusState.txHistory,
    ).filter((sourceTxHash) => {
      const bridgeHistoryItem =
        this.state.bridgeStatusState.txHistory[sourceTxHash];

      const hexSourceChainId = new Numeric(
        bridgeHistoryItem.quote.srcChainId,
        10,
      ).toPrefixedHexString() as `0x${string}`;
      const hexDestChainId = new Numeric(
        bridgeHistoryItem.quote.destChainId,
        10,
      ).toPrefixedHexString() as `0x${string}`;

      return (
        bridgeHistoryItem.account === address &&
        (hexSourceChainId === selectedChainId ||
          hexDestChainId === selectedChainId)
      );
    });

    sourceTxHashesToDelete.forEach((sourceTxHash) => {
      this.stopPollingByPollingToken(
        this.#pollingTokensBySrcTxHash[sourceTxHash],
      );
    });

    this.update((_state) => {
      _state.bridgeStatusState.txHistory = sourceTxHashesToDelete.reduce(
        (acc, sourceTxHash) => {
          delete acc[sourceTxHash];
          return acc;
        },
        _state.bridgeStatusState.txHistory,
      );
    });
  };
}