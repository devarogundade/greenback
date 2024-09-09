import create from 'vue-zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
    EphemeralKeyPair,
    KeylessAccount,
    type ProofFetchStatus,
} from '@aptos-labs/ts-sdk';
import { LocalStorageKeys, aptos } from '@/scripts/constants';
import { validateIdToken } from '@/scripts/id-token';
import {
    EphemeralKeyPairEncoding,
    isValidEphemeralKeyPair,
    validateEphemeralKeyPair,
} from '@/scripts/ephemeral';
import { type EncryptedScopedIdToken } from '@/types';
import { KeylessAccountEncoding, validateKeylessAccount } from '@/scripts/keyless';

interface KeylessAccountsState {
    accounts: {
        idToken: { decoded: EncryptedScopedIdToken; raw: string; };
        pepper: Uint8Array;
    }[];
    keylessAccount?: KeylessAccount;
    ephemeralKeyPair?: EphemeralKeyPair;
}

interface KeylessAccountsActions {
    commitEphemeralKeyPair: (account: EphemeralKeyPair) => void;
    disconnectKeylessAccount: () => void;
    getEphemeralKeyPair: () => EphemeralKeyPair | undefined;
    switchKeylessAccount: (
        idToken: string
    ) => Promise<KeylessAccount | undefined>;
}

const storage = createJSONStorage<KeylessAccountsState>(() => localStorage, {
    replacer: (_, e) => {
        if (typeof e === "bigint") return { __type: "bigint", value: e.toString() };
        if (e instanceof Uint8Array)
            return { __type: "Uint8Array", value: Array.from(e) };
        if (e instanceof EphemeralKeyPair)
            return EphemeralKeyPairEncoding.encode(e);
        if (e instanceof KeylessAccount) return KeylessAccountEncoding.encode(e);
        return e;
    },
    reviver: (_, e: any) => {
        if (e && e.__type === "bigint") return BigInt(e.value);
        if (e && e.__type === "Uint8Array") return new Uint8Array(e.value);
        if (e && e.__type === "EphemeralKeyPair")
            return EphemeralKeyPairEncoding.decode(e);
        if (e && e.__type === "KeylessAccount")
            return KeylessAccountEncoding.decode(e);
        return e;
    },
});

export const useKeylessAccounts = create<
    KeylessAccountsState & KeylessAccountsActions
>()(
    persist(
        (set, get, store) => ({
            ...({ accounts: [] } satisfies KeylessAccountsState),
            ...({
                commitEphemeralKeyPair: (keyPair) => {
                    const valid = isValidEphemeralKeyPair(keyPair);
                    if (!valid)
                        throw new Error(
                            "addEphemeralKeyPair: Invalid ephemeral key pair provided"
                        );
                    set({ ephemeralKeyPair: keyPair });
                },

                disconnectKeylessAccount: () => set({ keylessAccount: undefined }),

                getEphemeralKeyPair: () => {
                    const account = get().ephemeralKeyPair;
                    return account ? validateEphemeralKeyPair(account) : undefined;
                },

                switchKeylessAccount: async (idToken: string) => {
                    set({ ...get(), keylessAccount: undefined }, true);

                    // If the idToken is invalid, return undefined
                    const decodedToken = validateIdToken(idToken);
                    if (!decodedToken) {
                        throw new Error(
                            "switchKeylessAccount: Invalid idToken provided, could not decode"
                        );
                    }

                    // If a corresponding Ephemeral key pair is not found, return undefined
                    const ephemeralKeyPair = get().getEphemeralKeyPair();
                    if (
                        !ephemeralKeyPair ||
                        ephemeralKeyPair?.nonce !== decodedToken.nonce
                    ) {
                        throw new Error(
                            "switchKeylessAccount: Ephemeral key pair not found"
                        );
                    }

                    // Create a handler to allow the proof to be computed asynchronously.
                    const proofFetchCallback = async (res: ProofFetchStatus) => {
                        if (res.status === "Failed") {
                            get().disconnectKeylessAccount();
                        } else {
                            store.persist.rehydrate();
                        }
                    };

                    // Derive and store the active account
                    const storedAccount = get().accounts.find(
                        (a) => a.idToken.decoded.sub === decodedToken.sub
                    );
                    let keylessAccount: KeylessAccount | undefined;
                    try {
                        keylessAccount = await aptos.deriveKeylessAccount({
                            ephemeralKeyPair,
                            jwt: idToken,
                            proofFetchCallback,
                        });
                    } catch (error) {
                        // If we cannot derive an account using the pepper service, attempt to derive it using the stored pepper
                        if (!storedAccount?.pepper) throw error;
                        keylessAccount = await aptos.deriveKeylessAccount({
                            ephemeralKeyPair,
                            jwt: idToken,
                            pepper: storedAccount.pepper,
                            proofFetchCallback,
                        });
                    }

                    // Store the account and set it as the active account
                    const { pepper } = keylessAccount;
                    set({
                        accounts: storedAccount
                            ? // If the account already exists, update it. Otherwise, append it.
                            get().accounts.map((a) =>
                                a.idToken.decoded.sub === decodedToken.sub
                                    ? {
                                        idToken: { decoded: decodedToken, raw: idToken },
                                        pepper,
                                    }
                                    : a
                            )
                            : [
                                ...get().accounts,
                                { idToken: { decoded: decodedToken, raw: idToken }, pepper },
                            ],
                        keylessAccount,
                    });

                    return keylessAccount;
                },
            } satisfies KeylessAccountsActions),
        }),
        {
            merge: (persistedState, currentState) => {
                const merged = { ...currentState, ...(persistedState as object) };
                return {
                    ...merged,
                    keylessAccount:
                        merged.keylessAccount &&
                        validateKeylessAccount(merged.keylessAccount),
                    ephemeralKeyPair:
                        merged.ephemeralKeyPair &&
                        validateEphemeralKeyPair(merged.ephemeralKeyPair),
                };
            },
            name: LocalStorageKeys.keylessAccounts,
            partialize: ({ keylessAccount, ephemeralKeyPair, ...state }) => ({
                ...state,
                keylessAccount: keylessAccount && validateKeylessAccount(keylessAccount),
                ephemeralKeyPair:
                    ephemeralKeyPair && validateEphemeralKeyPair(ephemeralKeyPair),
            }),
            storage,
            version: 1,
        }
    )
);