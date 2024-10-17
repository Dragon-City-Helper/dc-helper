import { HttpStatusCode } from "axios";

export interface ApiResponse<T> {
  status: HttpStatusCode;
  data: T;
  message: String;
}
