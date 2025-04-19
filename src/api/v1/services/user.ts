
import { User } from "../models/user";
import {
    getItems,
    createItems,
    updateItems,
    deleteItems
} from "../repositories/firestore";

const COLLECTION = "users";

export const getAllUsers = async (): Promise<User[]> => {
    const snapshot: FirebaseFirestore.QuerySnapshot = await getItems(
        COLLECTION
    );

    return snapshot.docs.map((doc) => {
        const data: FirebaseFirestore.DocumentData = doc.data();
        return { id: doc.id, ...data } as unknown as User;
    });
};



export const createUser = async (item: Partial<User>): Promise<User> => {
    const id: string = await createItems(COLLECTION, item);
    return { id, ...item } as User;
};


export const updateUser = async (
    id: string,
    item: Partial<User>
): Promise<User> => {
    await updateItems(COLLECTION, id, item);
    return { id, ...item } as User;
};


export const deleteUser = async (id: string) => {
    await deleteItems(COLLECTION, id);
    return {
        message: 'User deleted successfully'
    }
};
