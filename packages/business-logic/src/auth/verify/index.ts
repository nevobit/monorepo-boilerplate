import { NormalizedRequest } from "@repo/constant-definitions";
import crypto from 'crypto';

const { NODE_ENV, API_SECRET } = process.env;

export const verify = async ({ protocol, headers, body }: NormalizedRequest) => {
    const typedHeaders = headers as {
        "x-timestamp": string,
        "x-signature": string,
        "x-path": string
    };
    const timestamp = typedHeaders["x-timestamp"];
    const signature = typedHeaders["x-signature"];
    const path = typedHeaders["x-path"];

    const isHttps = protocol === 'https' || NODE_ENV! == 'development';
    if (!isHttps) {
        return { type: "error", message: 'Bad Request: The request must be made over HTTPS' }
    }

    if (!timestamp || !signature) {
        return { type: "error", message: "Unauthorized: Signature or timestamp is missing" }
    }

    const timestampNum = parseInt(timestamp, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (currentTimestamp - timestampNum > 5 * 60) {
        return { type: "error", message: 'Unauthorized: Request has expired' };
    }

    const bodyString = typeof body === 'string' ? body : JSON.stringify(body || {});
    const dataToSign = `${path}|${bodyString}|${timestamp}`;
    const expectedSignature = crypto
        .createHmac('sha256', API_SECRET!)
        .update(dataToSign)
        .digest('hex');


    if (signature !== expectedSignature) {
        return { type: "error", message: 'Unauthorized: Invalid signature' }
    }
}