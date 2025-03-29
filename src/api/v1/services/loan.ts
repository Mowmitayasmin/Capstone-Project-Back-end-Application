import { Loan } from "../models/loan";
import {
    getItems,
    createItems,
    updateItems,
    deleteItems
} from "../repositories/firestore";

const COLLECTION = "loans";

export const getAllLoans = async (): Promise<Loan[]> => {
    const snapshot: FirebaseFirestore.QuerySnapshot = await getItems(
        COLLECTION
    );

    return snapshot.docs.map((doc) => {
        const data: FirebaseFirestore.DocumentData = doc.data();
        return { id: doc.id, ...data } as unknown as Loan;
    });
};

export const createLoan = async (item: Partial<Loan>): Promise<Loan> => {
    const id: string = await createItems(COLLECTION, item);
    return { id, ...item } as Loan;
};

export const updateLoan = async (
    id: string,
    item: Partial<Loan>
): Promise<Loan> => {
    await updateItems(COLLECTION, id, item);
    return { id, ...item } as Loan;
};

export const deleteLoan = async (id: string): Promise<void> => {
    await deleteItems(COLLECTION, id);
};
