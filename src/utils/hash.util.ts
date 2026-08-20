import * as crypto from 'crypto';

/**
 * Generates a deterministic hash for a given payload.
 * The same exact payload will always produce the exact same hash.
 * Used when we need to identify a specific relation or content (e.g. quantaHash if it represents a semantic relation).
 *
 * @param payloadString - The normalized string representation of the payload.
 * @returns A 66-character string representing the 256-bit SHA-256 hash (prefixed with '0x').
 */
export function generateDeterministicHash(payloadString: string): string {
  const hash = crypto.createHash('sha256').update(payloadString).digest('hex');
  return `0x${hash}`;
}

/**
 * Generates a unique operation hash for a given payload.
 * Incorporates a cryptographically secure nonce to ensure that two identical operations
 * produce different hashes.
 * Used for transaction hashes (txHash) to guarantee strict uniqueness per operation.
 *
 * @param payloadString - The normalized string representation of the payload.
 * @returns A 66-character string representing the 256-bit SHA-256 hash (prefixed with '0x').
 */
export function generateUniqueOperationHash(payloadString: string): string {
  const nonce = crypto.randomUUID();
  const hash = crypto.createHash('sha256').update(`${payloadString}-${nonce}`).digest('hex');
  return `0x${hash}`;
}
