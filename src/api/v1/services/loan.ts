import { QueryOptions } from "../models/filtering";
import { Loan } from "../models/loan";
import {
  getItems,
  createItems,
  updateItems,
  deleteItems,
  getItemById,
} from "../repositories/firestore";

const COLLECTION = "loans";

export const getAllLoans = async (
  queryOptions?: QueryOptions
): Promise<Loan[]> => {
  const snapshot = await getItems(COLLECTION, queryOptions || {});
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data } as Loan;
  });
};

export const createLoan = async (item: Partial<Loan>): Promise<Loan> => {
  const id: string = await createItems(COLLECTION, item);
  return { id, ...item } as Loan;
};

export const getById = async (
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot> => {
  return await getItemById(COLLECTION, id);
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
