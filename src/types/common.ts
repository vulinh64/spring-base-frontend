export interface GenericResponse<T> {
  errorCode: string;
  displayMessage: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  page: {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string | string[];
}
