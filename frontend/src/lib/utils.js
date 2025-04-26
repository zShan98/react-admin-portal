import axios from "axios";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const request = (options) => {
  const token = sessionStorage.getItem('token');

  if (token)
    client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response) => response.data;
  const onError = (error) => {
    if (error.status === 401) {
      location.reload();
      sessionStorage.removeItem('token');
      return;
    }
    throw new Error(error.response?.data.error ?? 'Could not fetch');
  };

  return client(options).then(onSuccess).catch(onError);
}
