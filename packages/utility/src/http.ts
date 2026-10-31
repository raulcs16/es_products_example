export type FieldError = {
  field: string;
  message: string;
};

export type APISuccess<TData> = {
  success: true;
  data: TData;
  message: string;
};

export type APIError<TCode extends string = string> = {
  success: false;
  code: TCode;
  message: string;
  errors: FieldError[];
};

export type ApiResponse<T> = APISuccess<T> | APIError;

export const NETWORK_ERROR: APIError = {
  success: false,
  code: "NETWORK_ERROR",
  message: "connection lost",
  errors: [],
};
export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

export interface RequestOptions {
  path: string;
  method: HttpMethod;
  body?: string; // Strictly expected to be a pre-stringified JSON string
}
