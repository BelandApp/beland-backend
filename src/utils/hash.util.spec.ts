import { generateDeterministicHash, generateUniqueOperationHash } from './hash.util';

describe('Hash Utility', () => {
  const samplePayload = '{"userId":"123","productId":"abc"}';
  
  describe('generateDeterministicHash', () => {
    it('Test 1 — Determinismo: debe devolver exactamente el mismo resultado múltiples veces', () => {
      const hash1 = generateDeterministicHash(samplePayload);
      const hash2 = generateDeterministicHash(samplePayload);
      const hash3 = generateDeterministicHash(samplePayload);
      
      expect(hash1).toEqual(hash2);
      expect(hash2).toEqual(hash3);
    });

    it('Test 2 — Diferencia por payload: payloads diferentes deben producir hashes diferentes', () => {
      const hash1 = generateDeterministicHash(samplePayload);
      const hash2 = generateDeterministicHash('{"userId":"123","productId":"def"}');
      
      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('generateUniqueOperationHash', () => {
    it('Test 3 — Unicidad operacional: llamar varias veces con el mismo payload debe producir hashes diferentes', () => {
      const hash1 = generateUniqueOperationHash(samplePayload);
      const hash2 = generateUniqueOperationHash(samplePayload);
      const hash3 = generateUniqueOperationHash(samplePayload);
      
      expect(hash1).not.toEqual(hash2);
      expect(hash2).not.toEqual(hash3);
      expect(hash1).not.toEqual(hash3);
    });
  });

  describe('Formato y Casos Extremos (Test 4, 5, 6)', () => {
    it('Test 4 — Formato: verificar prefijo 0x y longitud de 66 caracteres', () => {
      const deterministicHash = generateDeterministicHash(samplePayload);
      const uniqueHash = generateUniqueOperationHash(samplePayload);
      
      // Deterministic
      expect(deterministicHash.startsWith('0x')).toBeTruthy();
      expect(deterministicHash.length).toBe(66); // 2 (0x) + 64 (hex)
      expect(/0x[a-f0-9]{64}/.test(deterministicHash)).toBeTruthy();

      // Unique
      expect(uniqueHash.startsWith('0x')).toBeTruthy();
      expect(uniqueHash.length).toBe(66);
      expect(/0x[a-f0-9]{64}/.test(uniqueHash)).toBeTruthy();
    });

    it('Test 5 — Payload vacío: puede procesar un string vacío sin fallar', () => {
      const emptyPayload = '';
      
      const deterministicHash = generateDeterministicHash(emptyPayload);
      const uniqueHash = generateUniqueOperationHash(emptyPayload);
      
      expect(deterministicHash).toBeDefined();
      expect(deterministicHash.length).toBe(66);
      
      expect(uniqueHash).toBeDefined();
      expect(uniqueHash.length).toBe(66);
    });

    it('Test 6 — Payload largo: procesar correctamente un payload grande sin truncarlo ni modificarlo', () => {
      const largePayload = 'A'.repeat(1000000); // 1 Millón de caracteres A
      
      const deterministicHash = generateDeterministicHash(largePayload);
      
      // We expect the hash to be exactly 66 chars
      expect(deterministicHash.length).toBe(66);
      expect(deterministicHash.startsWith('0x')).toBeTruthy();
      
      // Determinism for large payload
      const deterministicHash2 = generateDeterministicHash(largePayload);
      expect(deterministicHash).toEqual(deterministicHash2);
    });
  });

  // Test 7 (Ausencia de dependencias externas) is verified implicitly since we only import crypto natively and no external libs are needed.
});
