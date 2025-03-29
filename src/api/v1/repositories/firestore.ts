import { db } from "../../../../config/firebaseConfig";
import { RepositoryError } from "../errors/errors";


export const runTransaction = async <T>(
    operations: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
    try {
        return await db.runTransaction(operations);
    } catch (error: unknown) {
        throw new RepositoryError(
            `Transaction failed`, 'TRANSACTION_FAILED'
        );
    }
};


export const createItems = async <T>(
    collectionName: string,
    data: Partial<T>,
    id?: string
): Promise<string> => {
    try {
        let item: FirebaseFirestore.DocumentReference;

        if (id) {
            item = db.collection(collectionName).doc(id);
            await item.set(data);
        } else {
            item = await db.collection(collectionName).add(data);
        }
        return item.id

    } catch (error: unknown) {
        throw new RepositoryError(
            'Failed to create', 'FAILED_CREATE'
        );
    }
};

export const getItems = async (
    collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
    try {
       
        return await db.collection(collectionName).get();
    } catch (error: unknown) {
        throw new RepositoryError(
            'Retrive issue', 'RETRIVE_ISSUE'
        );
    }
};


export const getItemById = async (
    collectionName: string,
    id: string
): Promise<FirebaseFirestore.DocumentSnapshot> => {
    try {
        const item: FirebaseFirestore.DocumentSnapshot = await db
            .collection(collectionName)
            .doc(id)
            .get();

        if (!item.id) {
            throw new RepositoryError(
                'Item not found', 'NOT_FOUND', 404
            );
        }

        return item;
    } catch (error: unknown) {
        if (error instanceof RepositoryError) {
            throw error;
        }

        throw new RepositoryError(
            'Item not found', 'NOT_FOUND', 404
        );
    }
};

export const updateItems = async <T>(
    collectionName: string,
    id: string,
    data: Partial<T>
): Promise<void> => {
    try {
        await db.collection(collectionName).doc(id).update(data);
    } catch (error: unknown) {
        throw new RepositoryError(
            'Item can not update', 'NOT_FOUND', 422

        );
    }
};


export const deleteItems= async (
    collectionName: string,
    id: string,
    transaction?: FirebaseFirestore.Transaction
): Promise<void> => {
    try {
        const item: FirebaseFirestore.DocumentReference = db
            .collection(collectionName)
            .doc(id);


        const docSnapshot = await item.get();
        if (!docSnapshot.exists) {
            throw new RepositoryError(
                'Item not found', 'NOT_FOUND', 404
            );
        }

        if (transaction) {
            transaction.delete(item);
        } else {
            await item.delete();
        }
    } catch (error: unknown) {
        throw new RepositoryError(
            'Item not found', 'NOT_FOUND', 404
        );
    }
};

