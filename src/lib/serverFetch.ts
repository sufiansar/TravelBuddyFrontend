/**
 * @deprecated
 * This file is DEPRECATED and should NOT be used.
 *
 * Use the centralized API utilities instead:
 * - Import from: @/actions/shared/apiClient
 * - Function: makeApiCall(endpoint, options, requireAuth)
 *
 * Example:
 * import { makeApiCall } from "@/actions/shared/apiClient";
 * const data = await makeApiCall("/endpoint", {}, true);
 *
 * See API_USAGE_GUIDE.md for complete documentation.
 */

export const serverFetch = {
  get: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    throw new Error(
      "serverFetch is deprecated. Use makeApiCall from @/actions/shared/apiClient instead."
    );
  },

  post: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    throw new Error(
      "serverFetch is deprecated. Use makeApiCall from @/actions/shared/apiClient instead."
    );
  },

  put: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    throw new Error(
      "serverFetch is deprecated. Use makeApiCall from @/actions/shared/apiClient instead."
    );
  },

  patch: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    throw new Error(
      "serverFetch is deprecated. Use makeApiCall from @/actions/shared/apiClient instead."
    );
  },

  delete: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    throw new Error(
      "serverFetch is deprecated. Use makeApiCall from @/actions/shared/apiClient instead."
    );
  },
};
