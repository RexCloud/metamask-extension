import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider, useSelector } from 'react-redux';
import configureStore, { MetaMaskReduxState } from '../../../../store/store';
import ConvertTokenToNFTModal from './convert-token-to-nft-modal';
import { CHAIN_IDS } from '../../../../../shared/constants/network';
import { mockNetworkState } from '../../../../../test/stub/networks';
const storeMock = configureStore({
  metamask: {
    AccountTracker: {
      accounts: {
        '0x1234567890abcdef1234567890abcdef12345678': {
          balance: '1000000000000000000',
        },
      },
    },
    TokensController: {
      tokens: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          symbol: 'ETH',
          decimals: 18,
        },
      ],
    },
    NftController: {
      allNfts: [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          tokenId: '1',
        },
      ],
    },
    AccountsController: {
      internalAccounts: {
        accounts: {
          'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3': {
            address: '0x1234567890abcdef1234567890abcdef12345678',
            id: 'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3',
            metadata: {
              name: 'Test Account',
              keyring: {
                type: 'HD Key Tree',
              },
            },
            options: {},
            methods: [],
            type: 'Eoa',
          },
        },
        selectedAccount: 'cf8dace4-9439-4bd4-b3a8-88c821c8fcb3',
      },
    },
    NetworkController: {
      ...mockNetworkState({ chainId: CHAIN_IDS.MAINNET }),
    },
    PreferencesController: {
      selectedAddress: '0x1234567890abcdef1234567890abcdef12345678',
      preferences: {
        useCurrencyRateCheck: true,
        currentCurrency: 'ETH',
        currencyRates: {
          ETH: {
            conversionRate: 1,
          },
        },
      },
      identities: {
        '0x1234567890abcdef1234567890abcdef12345678': {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          name: 'Test Account',
        },
      },
    },
  },
});

const DebugWrapper = ({ children }) => {
  const allNfts = useSelector(
    (state: MetaMaskReduxState) => state.metamask.NftController.allNfts,
  );
  console.log('allNfts:', allNfts);
  return children;
};

const meta: Meta<typeof ConvertTokenToNFTModal> = {
  title: 'Components/App/Modals/ConvertTokenToNFTModal',
  component: ConvertTokenToNFTModal,
  parameters: {
    docs: {
      // page: README, // Commented out as README.mdx does not exist
    },
  },
  decorators: [
    (Story) => (
      <Provider store={storeMock}>
        <DebugWrapper>
          <Story />
        </DebugWrapper>
      </Provider>
    ),
  ],
  argTypes: {
    hideModal: { action: 'hideModal' },
    tokenAddress: { control: 'text' },
  },
  args: {
    hideModal: () => {},
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
  },
};

export default meta;
type Story = StoryObj<typeof ConvertTokenToNFTModal>;

export const DefaultStory: Story = {};

DefaultStory.storyName = 'Default';

