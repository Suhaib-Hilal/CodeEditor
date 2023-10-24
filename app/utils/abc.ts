export function getRandomNumber(digitCount: number) {
  return Math.floor(Math.random() * 10 ** digitCount);
}

export function correctEmailFormat(email: string) {
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  if (!email) return false;
  return email.match(emailRegex);
}