import Axios, { AxiosError } from "axios";

const Api = Axios.create({
  baseURL: "/api",
});

Api.interceptors.request.use((config) => {
  config.headers.Server = window?.location?.origin;
  return config;
});

Api.interceptors.response.use(
  ({ headers, data }) => {
    const total = headers["x-total-count"] || headers["x-wp-totalpages"];

    if (total != null) {
      return {
        total: parseInt(total),
        list: data,
      };
    }

    return data;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error?.response?.data?.message || "Ocorreu um erro";

    if (error?.response?.status == 401) {
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 4000);
    }

    return Promise.reject(new Error(message));
  }
);

export default Api;
