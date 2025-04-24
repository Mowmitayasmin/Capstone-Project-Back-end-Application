export type Filter = {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
};

export type Sort = {
  field: string;
  direction: FirebaseFirestore.OrderByDirection;
};

export type QueryOptions = {
  filters?: Filter[];

  limit?: number;
};
