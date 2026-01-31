'use server';

import { StreamClient } from '@stream-io/node-sdk';

const NEXT_PUBLIC_STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async (userId?: string) => {
  if (!NEXT_PUBLIC_STREAM_API_KEY) throw new Error('Stream API key secret is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(NEXT_PUBLIC_STREAM_API_KEY, STREAM_API_SECRET);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  // Use the provided userId or generate a default one
  const finalUserId = userId || `public-user-${Date.now()}`;
  const token = streamClient.createToken(finalUserId, expirationTime, issuedAt);

  return token;
};
