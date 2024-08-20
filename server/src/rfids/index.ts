/* eslint-disable prettier/prettier */

export const RFIDMaker = {
    generateRFIDCard(): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('MY_ONLY_RFID_ID_LOL_1');
            }, 100);
        });
    }
};
