
import { Loan } from "../models/loan";
import {
    getItems,
    createItems,
    updateItems,
    deleteItems
} from "../repositories/firestore";

const COLLECTION = "loans";
const loans: Loan[] = [];

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
    console.log('loan', item)
    const id: string = await createItems(COLLECTION, item);
    return { id, ...item } as Loan;
};

export const getLoanById = async (id: string): Promise<Loan | null> => {
    const loan = loans.find(loan => loan.id === id);
    return loan || null;
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
