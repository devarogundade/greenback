/* eslint-disable prettier/prettier */

export const RFIDMaker = {
    generateRFIDCard(): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(process.env.MY_ONLY_RFID_ID_LOL);
            }, 100);
        });
    }
};
