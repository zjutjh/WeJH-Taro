interface RequestFnParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** 用对象表示的 body */
  data?: Partial<Record<string, unknown>>;
  /** 用对象表示的 query 参数 */
  params?: Partial<Record<string, unknown>>;
}

export interface ServiceOptions<O> {
  baseURL?: string;
  request<R>(
    params: RequestFnParams,
    /** 各端请求函数需要的自定义参数 */
    options?: O
  ): Promise<R>;
}

export abstract class BaseService<TOptions> {
  #baseURL: string = "";
  request: ServiceOptions<TOptions>["request"] = () => {
    throw new Error("Service.request is undefined");
  };

  constructor(options: ServiceOptions<TOptions>) {
    this.request = options.request;
    this.#baseURL = options.baseURL ?? "";
  }

  genBaseURL(path: `/${string}`) {
    return this.#baseURL + path;
  }
}

export const SERVICE_TIMEOUT = 15000 as const;
