import configPromise from "@payload-config";
import { cache } from "react";
import { getPayload, type Payload } from "payload";

let payloadPromise: Promise<Payload> | null = null;

export const getPayloadInstance = cache(async () => {
  payloadPromise ??= getPayload({
    config: configPromise,
  });

  return payloadPromise;
});
