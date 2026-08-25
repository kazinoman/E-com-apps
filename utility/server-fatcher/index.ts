import { z } from "zod";
import { AxiosRequestConfig } from "axios";

import { api } from "@/lib/api/axios";

// 1. Options for GET and DELETE (No schema, no body)
interface FetchOptions {
  url: string;
  config?: AxiosRequestConfig;
}

// 2. Options for POST, PUT, and PATCH (Requires data AND schema)
interface FetchOptionsWithData<T, D> {
  url: string;
  data: D;
  schema: z.ZodSchema<T>;
  config?: AxiosRequestConfig;
}

export const serverApi = {
  // GET: Pass the expected type <T> directly to Axios
  get: async <T>({ url, config }: FetchOptions): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  // DELETE: Pass the expected type <T> directly to Axios
  delete: async <T>({ url, config }: FetchOptions): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },

  // POST, PUT, PATCH: Continue enforcing Zod schema validation at runtime
  post: async <T, D>({ url, data, schema, config }: FetchOptionsWithData<T, D>): Promise<T> => {
    const response = await api.post(url, data, config);
    return schema.parse(response.data);
  },

  put: async <T, D>({ url, data, schema, config }: FetchOptionsWithData<T, D>): Promise<T> => {
    const response = await api.put(url, data, config);
    return schema.parse(response.data);
  },

  patch: async <T, D>({ url, data, schema, config }: FetchOptionsWithData<T, D>): Promise<T> => {
    const response = await api.patch(url, data, config);
    return schema.parse(response.data);
  },
};
