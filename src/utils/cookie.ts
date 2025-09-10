import { Cookies } from "react-cookie";

const cookies = new Cookies();

type CookieOptions = Parameters<Cookies["set"]>[2];

export const setCookie = (
  name: string,
  value: any,
  option?: CookieOptions
): void => {
  cookies.set(name, value, { ...option });
};

export const getCookie = (name: string): string | undefined => {
  return cookies.get(name);
};

export const deleteCookie = (name: string, options?: CookieOptions): void => {
  cookies.remove(name, options);
};
