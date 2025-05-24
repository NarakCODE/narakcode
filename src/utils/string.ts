import { formatIncompletePhoneNumber } from "libphonenumber-js";

export function decodeEmail(email: string) {
  return atob(email);
  // return email.replace(/\[at\]/g, "@").replace(/\[dot\]/g, ".");
}

export function decodePhoneNumber(phone: string) {
  return atob(phone);
}

export function formatPhoneNumber(phone: string) {
  return formatIncompletePhoneNumber(phone);
}
