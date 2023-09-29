export type AuthError = {
  code: string;
  message: string;
};

export function isAuthError(obj: any): boolean {
  return obj.code && obj.message;
}
