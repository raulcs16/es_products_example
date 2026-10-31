import {ApiResponse} from "@repo/utility/http"

export interface IPackageClient {
    health():Promise<ApiResponse<boolean>>;
}