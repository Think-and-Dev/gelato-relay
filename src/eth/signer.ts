import ethSigUtil from 'eth-sig-util';
// Warning we are using the dist folder as this functions are necesary but not exported by the SDK
// Base code from https://github.com/gelatodigital/relay-sdk/blob/02c146f984382d279b67dde6e8891ec31f0359e0/src/lib/sponsoredCallERC2771/index.ts#L77
import { getEIP712Domain, populateOptionalUserParameters, signTypedDataV4 } from "@gelatonetwork/relay-sdk/dist/utils";
import { isNetworkSupported } from "@gelatonetwork/relay-sdk/dist/lib/network";
import { SponsoredCallERC2771Request } from '@gelatonetwork/relay-sdk';
import { EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA, SponsoredCallERC2771PayloadToSign, SponsoredCallERC2771RequestOptionalParameters, SponsoredCallERC2771Struct } from '@gelatonetwork/relay-sdk/dist/lib/sponsoredCallERC2771/types';
import { BigNumber, providers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { EIP712_DOMAIN_TYPE_DATA } from '@gelatonetwork/relay-sdk/dist/lib/types';

// Base code from https://github.com/gelatodigital/relay-sdk/blob/02c146f984382d279b67dde6e8891ec31f0359e0/src/lib/sponsoredCallERC2771/index.ts#L38
const getPayloadToSign = (
  struct: SponsoredCallERC2771Struct
): SponsoredCallERC2771PayloadToSign => {
  const domain = getEIP712Domain(struct.chainId as number);
  return {
    domain,
    types: {
      ...EIP712_SPONSORED_CALL_ERC2771_TYPE_DATA,
      ...EIP712_DOMAIN_TYPE_DATA,
    },
    primaryType: "SponsoredCallERC2771",
    message: struct,
  };
};

// Base code from https://github.com/gelatodigital/relay-sdk/blob/02c146f984382d279b67dde6e8891ec31f0359e0/src/lib/sponsoredCallERC2771/index.ts#L53
const mapRequestToStruct = async (
  request: SponsoredCallERC2771Request,
  override: Partial<SponsoredCallERC2771RequestOptionalParameters>
): Promise<SponsoredCallERC2771Struct> => {
  if (!override.userNonce && !request.userNonce) {
    throw new Error(`userNonce is not found in the request, nor fetched`);
  }
  if (!override.userDeadline && !request.userDeadline) {
    throw new Error(`userDeadline is not found in the request, nor fetched`);
  }
  return {
    userNonce:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userNonce ?? BigNumber.from(request.userNonce!).toString(),
    userDeadline:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      override.userDeadline ?? BigNumber.from(request.userDeadline!).toString(),
    chainId: BigNumber.from(request.chainId).toString(),
    target: getAddress(request.target as string),
    data: request.data,
    user: getAddress(request.user as string),
  };
};

export async function signMetaTxRequest(signer: providers.Web3Provider, request: SponsoredCallERC2771Request) {
  
  const isSupported = await isNetworkSupported(Number(request.chainId));
  if (!isSupported) {
    throw new Error(`Chain id [${request.chainId}] is not supported`);
  }
  const parametersToOverride = await populateOptionalUserParameters(request, signer);
  const struct = await mapRequestToStruct(request, parametersToOverride);
  const signature = await signTypedDataV4(
    signer,
    request.user,
    getPayloadToSign(struct)
  );

  return { signature, struct };
}

