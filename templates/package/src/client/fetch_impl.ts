import { IPackageClient } from "./iclient";
import {
  ApiResponse,
  HTTP_METHODS,
  NETWORK_ERROR,
  RequestOptions,
} from "@repo/utility/http";

 export default class PackageFetchClient implements IPackageClient{

    constructor(private readonly baseUrl:string){}
 private async request<T>({
    path,
    method,
    body,
  }: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${path}`;
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      });
      return (await resp.json()) as ApiResponse<T>;
    } catch {
      return NETWORK_ERROR;
    }
  }
  public health(): Promise<ApiResponse<boolean>> {
      const  resp: ApiResponse<boolean>={
        success:true,
        data:true,
        message:"im healthy"
      }
      return resp;
  }
}
