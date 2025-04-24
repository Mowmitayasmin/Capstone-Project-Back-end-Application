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

/**
 * Retrieves all loan documents from the Firestore 'loans' collection.
 * Optionally filters the results based on provided query options.
 *
 * @param queryOptions - Optional query options used for filtering (e.g., limit, sort, filters).
 * @returns {Promise<Loan[]>} - A promise that resolves to an array of Loan objects.
 * @throws {Error} - If fetching loans from Firestore fails.
 */

export const getAllLoans = async (
  queryOptions?: QueryOptions
): Promise<Loan[]> => {
  const snapshot = await getItems(COLLECTION, queryOptions || {});
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data } as Loan;
  });
};

/**
 * Creates a new loan document in the Firestore 'loans' collection.
 *
 * @param item - Partial loan data to be saved (e.g., amount, borrowerId, status).
 * @returns {Promise<Loan>} - A promise that resolves to the newly created Loan object, including the generated ID.
 * @throws {Error} - If creating the loan in Firestore fails.
 */

export const createLoan = async (item: Partial<Loan>): Promise<Loan> => {
  const id: string = await createItems(COLLECTION, item);
  return { id, ...item } as Loan;
};

/**
 * Retrieves a specific loan document by its ID from Firestore.
 *
 * @param id - The ID of the loan to retrieve.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot>} - A promise that resolves to the Firestore document snapshot.
 * @throws {Error} - If the loan cannot be found or Firestore query fails.
 */

export const getById = async (
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot> => {
  return await getItemById(COLLECTION, id);
};

/**
 * Updates an existing loan document in Firestore by its ID.
 *
 * @param id - The ID of the loan to update.
 * @param item - Partial data representing fields to update in the loan document.
 * @returns {Promise<Loan>} - A promise that resolves to the updated Loan object.
 * @throws {Error} - If updating the loan in Firestore fails.
 */

export const updateLoan = async (
  id: string,
  item: Partial<Loan>
): Promise<Loan> => {
  await updateItems(COLLECTION, id, item);
  return { id, ...item } as Loan;
};

/**
 * Delete a loan document from Firestore by its ID.
 *
 * @param id - The ID of the loan to delete.
 * @returns {Promise<void>} - A promise that resolves when the loan is successfully deleted.
 * @throws {Error} - If deleting the loan in Firestore fails.
 */

export const deleteLoan = async (id: string): Promise<void> => {
  await deleteItems(COLLECTION, id);
};
