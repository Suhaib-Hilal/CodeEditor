import { NextRequest } from "next/server";
import OtpService from "../../(auth)/services/otp_service";

export async function POST(req: NextRequest) {
  const email = (await req.json()).email as string;
  console.log(14);
  const otp = await OtpService.sendOtp(email);
  console.log(otp);
  console.log(12);

  if (typeof otp != "string") {
    return new Response(JSON.stringify((otp as Error).message), {
      status: 500,
    });
  }
  console.log(otp);
  return new Response(JSON.stringify(otp), { status: 200 });
}
