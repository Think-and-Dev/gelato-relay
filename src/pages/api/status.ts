
import { NextApiRequest, NextApiResponse } from 'next';
import { GelatoRelay } from "@gelatonetwork/relay-sdk";

// Base code from https://github.com/gelatodigital/relay-sdk/blob/02c146f984382d279b67dde6e8891ec31f0359e0/src/lib/sponsoredCallERC2771/index.ts#L77
export default async function status(req: NextApiRequest, res:  NextApiResponse) {
  try {
    const API_KEY = process.env.RELAY_API_KEY;
    if (!API_KEY) throw new Error(`Missing relayer api key`);

    const taskId = req.query['transactionId'] as string;
    if (!taskId) throw new Error(`Missing taskId`);
    console.log(`Info from taskId`, taskId );

    const relay = new GelatoRelay();
    const status = await relay.getTaskStatus(taskId);
    
    console.log(`Status meta-tx:`, status);
    return res.status(200).json(status);
  } catch (error) {
    const errorMessage = (error as Error).message;
    throw new Error(`Gelato /tasks/status: Failed with error: ${errorMessage}`);
  }
}
