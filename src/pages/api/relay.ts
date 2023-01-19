import { RelayRequestOptions, RelayResponse, SponsoredCallERC2771Request } from "@gelatonetwork/relay-sdk";
import { SponsoredCallERC2771Struct, UserAuthSignature } from "@gelatonetwork/relay-sdk/dist/lib/sponsoredCallERC2771/types";
import { ApiKey, RelayCall } from "@gelatonetwork/relay-sdk/dist/lib/types";
import { postSponsoredCall } from "@gelatonetwork/relay-sdk/dist/utils";
import { NextApiRequest, NextApiResponse } from 'next';

import deployJson from '../../../contracts/deploy.json';
const CounterERC2771 = deployJson.CounterERC2771;

// Base code from https://github.com/gelatodigital/relay-sdk/blob/02c146f984382d279b67dde6e8891ec31f0359e0/src/lib/sponsoredCallERC2771/index.ts#L77
export default async function handler(req: NextApiRequest, res:  NextApiResponse) {
  try {
    const API_KEY = process.env.RELAY_API_KEY;
    if (!API_KEY) throw new Error(`Missing relayer api key`);

    const { struct, signature } = req.body;
    console.log(`Relaying`, req.body );

    // If we want to define options
    const options: RelayRequestOptions = {};
    
    const postResponse = await postSponsoredCall<
      SponsoredCallERC2771Struct &
        RelayRequestOptions &
        UserAuthSignature &
        ApiKey,
      RelayResponse
    >(RelayCall.SponsoredCallERC2771, {
      ...struct,
      ...options,
      userSignature: signature,
      sponsorApiKey: API_KEY,
    });

    console.log(`Sent meta-tx:`, postResponse);
    return res.status(200).json({ taskId: postResponse.taskId });
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`GelatoRelaySDK/sponsoredCallERC2771: Failed with error: ${errorMessage}`);
  }
}
