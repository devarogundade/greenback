import { computed } from 'vue';
import { createEphemeralKeyPair } from './ephemeral';
import { useKeylessAccounts } from './keyless-accounts';
import type { EphemeralKeyPair } from '@aptos-labs/ts-sdk';

export default function useEphemeralKeyPair() {
    const { commitEphemeralKeyPair, getEphemeralKeyPair } = useKeylessAccounts.getState();

    const ephemeralKeyPair = computed<EphemeralKeyPair>(() => {
        let keyPair = getEphemeralKeyPair();

        // If no key pair is found, create a new one and commit it to the store
        if (!keyPair) {
            keyPair = createEphemeralKeyPair();
            commitEphemeralKeyPair(keyPair);
        }

        return keyPair;
    });

    return ephemeralKeyPair;
}
