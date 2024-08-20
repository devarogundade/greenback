import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";

const Storage = {
    upload(
        file: File,
        name: string,
        onSuccess: (url: string) => void,
        onError?: (error: Error) => void,
        onProgress?: (progress: number) => void
    ) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) { onProgress(progress); }
            },
            (error) => {
                if (onError) { onError(error); }
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                onSuccess(url);
            }
        );
    },

    awaitUpload(file: File, name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.upload(
                file,
                name,
                (url: string) => {
                    resolve(url);
                },
                (error: Error) => {
                    reject(error);
                }
            );
        });
    }
};

export default Storage;