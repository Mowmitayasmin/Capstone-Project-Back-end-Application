import { Branch } from "../models/branch";
import {
  getItems,
  createItems,
  updateItems,
  deleteItems,
  getItemById,
} from "../repositories/firestore";

const COLLECTION = "branches";

/**
 * Retrieves all branch documents from the Firestore 'branches' collection.
 *
 * @returns {Promise<Branch[]>} - A promise that resolves to an array of Branch objects.
 * @throws {Error} - If fetching branches from Firestore fails.
 */

export const getAllBranches = async (): Promise<Branch[]> => {
  const snapshot: FirebaseFirestore.QuerySnapshot = await getItems(COLLECTION);

  return snapshot.docs.map((doc) => {
    const data: FirebaseFirestore.DocumentData = doc.data();
    return { id: doc.id, ...data } as unknown as Branch;
  });
};

/**
 * Creates a new branch in the Firestore 'branches' collection.
 *
 * @param item - Partial branch data to be saved (e.g., name, location).
 * @returns {Promise<Branch>} - A promise that resolves to the newly created Branch object, including the generated ID.
 * @throws {Error} - If creating the branch in Firestore fails.
 */

export const createBranch = async (item: Partial<Branch>): Promise<Branch> => {
  const id = await createItems(COLLECTION, item);
  return { id, ...item } as Branch;
};

/**
 * Retrieves a branch document from Firestore by its ID.
 *
 * @param id - The ID of the branch to retrieve.
 * @returns {Promise<FirebaseFirestore.DocumentSnapshot>} - A promise that resolves to the Firestore document snapshot.
 * @throws {Error} - If the branch cannot be found or Firestore query fails.
 */

export const getById = async (
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot> => {
  return await getItemById(COLLECTION, id);
};

/**
 * Updates an existing branch document in Firestore by its ID.
 *
 * @param id - The ID of the branch to update.
 * @param item - Partial data representing fields to update.
 * @returns {Promise<Branch>} - A promise that resolves to the updated Branch object.
 * @throws {Error} - If updating the branch in Firestore fails.
 */

export const updateBranch = async (
  id: string,
  item: Partial<Branch>
): Promise<Branch> => {
  await updateItems(COLLECTION, id, item);
  return { id, ...item } as Branch;
};

/**
 * Delete a branch document from Firestore by its ID.
 *
 * @param id - The ID of the branch to delete.
 * @returns {Promise<void>} - A promise that resolves when the branch is successfully deleted.
 * @throws {Error} - If deleting the branch in Firestore fails.
 */

export const deleteBranch = async (id: string): Promise<void> => {
  await deleteItems(COLLECTION, id);
};
