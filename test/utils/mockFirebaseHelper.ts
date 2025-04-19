import { firestore } from "firebase-admin";


export type MockFirestoreData = {
    [key: string]: unknown;
};

export type MockFirestoreCollection = {
    doc: jest.Mock;
    add: jest.Mock;
};

export type MockFirestoreQuery = {
    get: jest.Mock;
    where: jest.Mock;
    orderBy: jest.Mock;
    limit: jest.Mock;
};

export type MockSnapshot = {
    docs: FirestoreDocumentSnapshot[];
};

export type MockFirestoreDocumentSnapshot = {
    data: () => MockFirestoreData;
    id: string;
};

export type MockQuerySnapshot = {
    docs: MockFirestoreDocumentSnapshot[];
    forEach: jest.Mock;
    empty: boolean;
    size: number;
};

export type FirestoreDocumentSnapshot<T = unknown> = {
    id: string;
    data: () => T;
};

export type PartialMockFirestoreTransaction = Partial<{
    [K in keyof firestore.Transaction]: jest.Mock;
}>;

/**
 * mockFirestoreCollection creates a mock Firestore collection with a single document.
 *
 * @param docData - The data to be stored in the mock document
 * @param id - The ID of the mock document (defaults to "mockDocId" if not provided)
 *
 * @returns An object that mimics a Firestore collection reference
 *
 * Usage example:
 * const mockCollection = mockFirestoreCollection({ name: "John", age: 30 }, "user123");
 */
export const mockFirestoreCollection = (
    docData: MockFirestoreData,
    id: string = "mockDocId"
): MockFirestoreCollection => {
    return {
        doc: jest.fn().mockReturnValue({
            set: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue({
                id,
                exists: true,
                data: () => ({ ...docData }),
            }),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            id,
        }),
        add: jest.fn().mockResolvedValue({ id }),
    };
};

/**
 * mockFirestoreTransaction is a mock of a Firestore transaction object.
 * It provides mock functions for common transaction operations.
 *
 * Usage example:
 * // In your test:
 * mockFirestoreTransaction.get.mockResolvedValue(someMockDocumentData);
 */
export const mockFirestoreTransaction: jest.Mocked<firestore.Transaction> = {
    get: jest.fn(),
    getAll: jest.fn(),
    create: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

/**
 * mockQuerySnapshot creates a mock of a Firestore query snapshot.
 *
 * @param docs - An array of document data to be included in the snapshot
 *
 * @returns An object that mimics a Firestore query snapshot
 *
 * Usage example:
 * const mockSnapshot = mockQuerySnapshot([
 *     { id: "doc1", name: "John" },
 *     { id: "doc2", name: "Jane" }
 * ]);
 */
export const mockQuerySnapshot = (
    docs: MockFirestoreData[]
): MockQuerySnapshot => ({
    docs: docs.map((doc) => ({
        data: (): MockFirestoreData => doc,
        id: (doc.id as string) || "mockDocId",
    })),
    forEach: jest.fn((callback) =>
        docs.forEach((doc) =>
            callback({
                data: (): MockFirestoreData => doc,
                id: (doc.id as string) || "mockDocId",
            })
        )
    ),
    empty: docs.length === 0,
    size: docs.length,
});

/**
 * mockFirestoreQuery creates a mock of a Firestore query.
 *
 * @param docs - An array of document data to be returned by the query
 *
 * @returns An object that mimics a Firestore query
 *
 * Usage example:
 * const mockQuery = mockFirestoreQuery([
 *     { id: "doc1", name: "John" },
 *     { id: "doc2", name: "Jane" }
 * ]);
 */
export const mockFirestoreQuery = (
    docs: MockFirestoreData[]
): MockFirestoreQuery => ({
    get: jest.fn().mockResolvedValue(mockQuerySnapshot(docs)),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
});

