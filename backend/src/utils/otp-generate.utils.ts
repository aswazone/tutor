export function generateOtp(length: number = 6): string {
  let otp = '';
  const possible = '0123456789';

  for (let i = 0; i < length; i++) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return otp;
}

