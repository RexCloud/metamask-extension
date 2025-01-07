import log from 'loglevel';
import { TransactionDescription } from '@ethersproject/abi';
import { Nft, NftContract, Token } from '@metamask/assets-controllers';
import { getTokenStandardAndDetails } from '../../store/actions';
import { isEqualCaseInsensitive } from '../../../shared/modules/string-utils';
import { parseStandardTokenTransactionData } from '../../../shared/modules/transaction.utils';
import { TokenStandard } from '../../../shared/constants/transaction';
import { getTokenValueParam } from '../../../shared/lib/metamask-controller-utils';
import { calcTokenAmount } from '../../../shared/lib/transactions-controller-utils';
import { Numeric } from '../../../shared/modules/Numeric';
import * as util from './util';
import { formatCurrency } from './confirm-tx.util';

const DEFAULT_SYMBOL = '';

type TokenMap = {
  [address: string]: Pick<Token, 'symbol' | 'decimals' | 'name'>;
};

async function getSymbolFromContract(tokenAddress: string) {
  const token = util.getContractAtAddress(tokenAddress);
  try {
    const result = await token.symbol();
    return result[0];
  } catch (error) {
    log.warn(
      `symbol() call for token at address ${tokenAddress} resulted in error:`,
      error,
    );
    return undefined;
  }
}

async function getNameFromContract(tokenAddress: string) {
  const token = util.getContractAtAddress(tokenAddress);
  try {
    const [name] = await token.name();
    return name;
  } catch (error) {
    log.warn(
      `name() call for token at address ${tokenAddress} resulted in error:`,
      error,
    );
    return undefined;
  }
}

async function getDecimalsFromContract(tokenAddress: string) {
  const token = util.getContractAtAddress(tokenAddress);

  try {
    const result = await token.decimals();
    const decimalsBN = result[0];
    return decimalsBN?.toString();
  } catch (error) {
    log.warn(
      `decimals() call for token at address ${tokenAddress} resulted in error:`,
      error,
    );
    return undefined;
  }
}

export function getTokenMetadata(tokenAddress: string, tokenList: TokenMap) {
  return tokenAddress && tokenList[tokenAddress.toLowerCase()];
}

async function getSymbol(tokenAddress: string, tokenList: TokenMap) {
  let symbol = await getSymbolFromContract(tokenAddress);

  if (!symbol) {
    const contractMetadataInfo = getTokenMetadata(tokenAddress, tokenList);

    if (contractMetadataInfo) {
      symbol = contractMetadataInfo.symbol;
    }
  }

  return symbol;
}

async function getName(tokenAddress: string, tokenList: TokenMap) {
  let name = await getNameFromContract(tokenAddress);

  if (!name) {
    const contractMetadataInfo = getTokenMetadata(tokenAddress, tokenList);

    if (contractMetadataInfo) {
      name = contractMetadataInfo.name;
    }
  }

  return name;
}

async function getDecimals(tokenAddress: string, tokenList: TokenMap) {
  let decimals = await getDecimalsFromContract(tokenAddress);

  if (!decimals || decimals === '0') {
    const contractMetadataInfo = getTokenMetadata(tokenAddress, tokenList);

    if (contractMetadataInfo) {
      decimals = contractMetadataInfo.decimals?.toString();
    }
  }

  return decimals;
}

export async function getSymbolAndDecimalsAndName(
  tokenAddress: string,
  tokenList: TokenMap,
) {
  let symbol, decimals, name;

  try {
    const results = await Promise.allSettled([
      getSymbol(tokenAddress, tokenList),
      getDecimals(tokenAddress, tokenList),
      getName(tokenAddress, tokenList),
    ]);
    const fulfilled = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    [symbol, decimals, name] = fulfilled;
  } catch (error) {
    log.warn(
      `symbol() and decimal() and name() calls for token at address ${tokenAddress} resulted in error:`,
      error,
    );
  }

  return {
    symbol: symbol || DEFAULT_SYMBOL,
    decimals,
    name,
  };
}

export function tokenInfoGetter() {
  const tokens: TokenMap = {};

  return async (
    address: string,
    tokenList: {
      [address: string]: Pick<Token, 'symbol' | 'decimals' | 'name'>;
    },
  ) => {
    if (tokens[address]) {
      return tokens[address];
    }

    tokens[address] = await getSymbolAndDecimalsAndName(address, tokenList);
    return tokens[address];
  };
}

/**
 * Attempts to get the address parameter of the given token transaction data
 * (i.e. function call) per the Human Standard Token ABI, in the following
 * order:
 * - The '_to' parameter, if present
 * - The first parameter, if present
 *
 * @param tokenData - ethers Interface token data.
 * @returns A lowercase address string or undefined.
 */
export function getTokenAddressParam(
  tokenData: Partial<TransactionDescription> = {},
) {
  const { args = [] } = tokenData;
  let value: unknown;
  if ('_to' in args) {
    value = args._to;
  } else if ('to' in args) {
    value = args.to;
  } else if (Array.isArray(args)) {
    value = args[0];
  }
  return value?.toString().toLowerCase();
}

/**
 * Gets the '_value' parameter of the given token transaction data
 * (i.e function call) per the Human Standard Token ABI, if present.
 *
 * @param tokenData - ethers Interface token data.
 * @returns A decimal string value or undefined.
 */
/**
 * Gets either the '_tokenId' parameter or the 'id' param of the passed token transaction data.,
 * These are the parsed tokenId values returned by `parseStandardTokenTransactionData` as defined
 * in the ERC721 and ERC1155 ABIs from metamask-eth-abis (https://github.com/MetaMask/metamask-eth-abis/tree/main/src/abis)
 *
 * @param tokenData - ethers Interface token data.
 * @returns A decimal string value or undefined.
 */
export function getTokenIdParam(
  tokenData: Partial<TransactionDescription> = {},
) {
  return (
    tokenData?.args?._tokenId?.toString() ?? tokenData?.args?.id?.toString()
  );
}

/**
 * Gets the '_approved' parameter of the given token transaction data
 * (i.e function call) per the Human Standard Token ABI, if present.
 *
 * @param tokenData - ethers Interface token data.
 * @returns A boolean indicating whether the function is being called to approve or revoke access, or undefined if the '_approved` parameter is not present.
 */
export function getTokenApprovedParam(
  tokenData: Partial<TransactionDescription> = {},
) {
  const { args = {} } = tokenData;
  if (!('_approved' in args)) {
    return undefined;
  }
  return Boolean(args._approved);
}

/**
 * Get the token balance converted to fiat and optionally formatted for display
 *
 * @param [contractExchangeRate] - The exchange rate between the current token and the native currency
 * @param conversionRate - The exchange rate between the current fiat currency and the native currency
 * @param currentCurrency - The currency code for the user's chosen fiat currency
 * @param [tokenAmount] - The current token balance
 * @param [tokenSymbol] - The token symbol
 * @param [formatted] - Whether the return value should be formatted or not
 * @param [hideCurrencySymbol] - excludes the currency symbol in the result if true
 * @returns The token amount in the user's chosen fiat currency, optionally formatted and localize, or undefined
 */
export function getTokenFiatAmount(
  contractExchangeRate: number | string,
  conversionRate: number,
  currentCurrency: string,
  tokenAmount: string,
  tokenSymbol: string,
  formatted = true,
  hideCurrencySymbol = false,
) {
  // If the conversionRate is 0 (i.e. unknown) or the contract exchange rate
  // is currently unknown, the fiat amount cannot be calculated so it is not
  // shown to the user
  if (
    conversionRate <= 0 ||
    !contractExchangeRate ||
    tokenAmount === undefined
  ) {
    return undefined;
  }

  const currentTokenToFiatRate = new Numeric(contractExchangeRate, 10).times(
    new Numeric(conversionRate, 10),
  );

  let currentTokenInFiat: Numeric | string = new Numeric(tokenAmount, 10);

  if (tokenSymbol !== currentCurrency.toUpperCase() && currentTokenToFiatRate) {
    currentTokenInFiat = currentTokenInFiat.applyConversionRate(
      currentTokenToFiatRate.toNumber(),
    );
  }

  currentTokenInFiat = currentTokenInFiat.round(2).toString();
  let result;
  if (hideCurrencySymbol) {
    result = formatCurrency(currentTokenInFiat, currentCurrency);
  } else if (formatted) {
    result = `${formatCurrency(
      currentTokenInFiat,
      currentCurrency,
    )} ${currentCurrency.toUpperCase()}`;
  } else {
    result = currentTokenInFiat;
  }
  return result.toString();
}

export async function getAssetDetails(
  tokenAddress: string,
  currentUserAddress: string,
  transactionData: string,
  existingNfts: (Nft & NftContract)[],
) {
  const tokenData = parseStandardTokenTransactionData(transactionData);
  if (!tokenData) {
    throw new Error('Unable to detect valid token data');
  }

  // Sometimes the tokenId value is parsed as "_value" param. Not seeing this often any more, but still occasionally:
  // i.e. call approve() on BAYC contract - https://etherscan.io/token/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#writeContract, and tokenId shows up as _value,
  // not sure why since it doesn't match the ERC721 ABI spec we use to parse these transactions - https://github.com/MetaMask/metamask-eth-abis/blob/d0474308a288f9252597b7c93a3a8deaad19e1b2/src/abis/abiERC721.ts#L62.
  let tokenId =
    getTokenIdParam(tokenData)?.toString() ?? getTokenValueParam(tokenData);

  const toAddress = getTokenAddressParam(tokenData);

  let tokenDetails;

  // if a tokenId is present check if there is an NFT in state matching the address/tokenId
  // and avoid unnecessary network requests to query token details we already have
  if (existingNfts?.length && tokenId) {
    const existingNft = existingNfts.find(
      ({ address, tokenId: _tokenId }) =>
        isEqualCaseInsensitive(tokenAddress, address) && _tokenId === tokenId,
    );

    if (existingNft && (existingNft.name || existingNft.symbol)) {
      return {
        toAddress,
        ...existingNft,
      };
    }
  }

  try {
    tokenDetails = await getTokenStandardAndDetails(
      tokenAddress,
      currentUserAddress,
      tokenId,
    );
  } catch (error) {
    log.warn(error);
    // if we can't determine any token standard or details return the data we can extract purely from the parsed transaction data
    return { toAddress, tokenId };
  }
  const tokenValue = getTokenValueParam(tokenData);
  const tokenDecimals = tokenDetails?.decimals;
  const tokenAmount =
    tokenData &&
    tokenValue &&
    tokenDecimals &&
    calcTokenAmount(tokenValue, tokenDecimals).toString(10);

  const decimals = tokenDecimals && Number(tokenDecimals);

  if (tokenDetails?.standard === TokenStandard.ERC20) {
    tokenId = undefined;
  }

  // else if not an NFT already in state or standard === ERC20 return tokenDetails and tokenId
  return {
    tokenAmount,
    toAddress,
    decimals,
    tokenId,
    ...tokenDetails,
  };
}