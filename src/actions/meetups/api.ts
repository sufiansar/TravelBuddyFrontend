import { makeApiCall } from "../shared/apiClient";

export const api = {
  meetups: {
    getAll: (filters?: any, options?: any) =>
      makeApiCall(
        `/meetups?${new URLSearchParams({
          ...filters,
          ...options,
        }).toString()}`,
        {},
        false
      ),

    getSingle: (id: string) => makeApiCall(`/meetups/${id}`, {}, false),

    create: (data: any) =>
      makeApiCall(
        "/meetups",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        true
      ),

    update: (id: string, data: any) =>
      makeApiCall(
        `/meetups/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
        true
      ),

    delete: (id: string) =>
      makeApiCall(
        `/meetups/${id}`,
        {
          method: "DELETE",
        },
        true
      ),

    join: (id: string) =>
      makeApiCall(
        `/meetups/${id}/join`,
        {
          method: "POST",
        },
        true
      ),

    leave: (id: string) =>
      makeApiCall(
        `/meetups/${id}/leave`,
        {
          method: "POST",
        },
        true
      ),

    getMembers: (id: string) => makeApiCall(`/meetups/${id}/members`, {}, true),
  },
};
