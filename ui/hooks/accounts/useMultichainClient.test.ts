import { renderHook } from '@testing-library/react-hooks';
import { HandlerType } from '@metamask/snaps-utils';
import { BtcAccountType, BtcMethod } from '@metamask/keyring-api';
import { MultichainNetworks } from '../../../shared/constants/multichain/networks';
import { BITCOIN_WALLET_SNAP_ID } from '../../../shared/lib/accounts/bitcoin-wallet-snap';
import { SOLANA_WALLET_SNAP_ID } from '../../../shared/lib/accounts/solana-wallet-snap';
import {
  handleSnapRequest,
  multichainUpdateBalance,
} from '../../store/actions';
import { useMultichainClient, WalletClientType } from './useMultichainClient';

jest.mock('../../store/actions', () => ({
  handleSnapRequest: jest.fn(),
  multichainUpdateBalance: jest.fn(),
}));

const mockHandleSnapRequest = handleSnapRequest as jest.Mock;
const mockMultichainUpdateBalance = multichainUpdateBalance as jest.Mock;

describe('useMultichainClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      clientType: WalletClientType.Bitcoin,
      network: MultichainNetworks.BITCOIN,
      snapId: BITCOIN_WALLET_SNAP_ID,
      mockAccount: {
        address: 'tb1q2hjrlnf8kmtt5dj6e49gqzy6jnpe0sj7ty50cl',
        id: '11a33c6b-0d46-43f4-a401-01587d575fd0',
        options: {},
        methods: [BtcMethod.SendBitcoin],
        type: BtcAccountType.P2wpkh,
      },
    },
    {
      clientType: WalletClientType.Solana,
      network: MultichainNetworks.SOLANA,
      snapId: SOLANA_WALLET_SNAP_ID,
      mockAccount: {
        address: '4mip4tgbhxf8dpqvtb3zhzzapwfvznanhssqzgjyp7ha',
        id: '22b44d7c-1e57-4b5b-8502-02698e686fd1',
        options: {},
        methods: ['someMethod'],
        type: 'solana:data-account',
      },
    },
  ];

  testCases.forEach(({ clientType, network, snapId, mockAccount }) => {
    it(`dispatches a Snap keyring request to create a ${clientType} account`, async () => {
      const { result } = renderHook(() => useMultichainClient(clientType));
      const multichainClient = result.current;

      mockHandleSnapRequest.mockResolvedValue(mockAccount);

      await multichainClient.createAccount(network);
      expect(mockHandleSnapRequest).toHaveBeenCalledWith({
        origin: 'metamask',
        snapId,
        handler: HandlerType.OnKeyringRequest,
        request: expect.any(Object),
      });
    });

    it(`force fetches the balance after creating a ${clientType} account`, async () => {
      const { result } = renderHook(() => useMultichainClient(clientType));
      const multichainClient = result.current;

      mockHandleSnapRequest.mockResolvedValue(mockAccount);

      await multichainClient.createAccount(network);
      expect(mockMultichainUpdateBalance).toHaveBeenCalledWith(mockAccount.id);
    });
  });
});
