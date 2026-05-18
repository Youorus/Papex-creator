export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export type OrderingDirection = "asc" | "desc";

export interface ApiListParams extends PaginationParams {
  search?: string;
  ordering?: string;
}
