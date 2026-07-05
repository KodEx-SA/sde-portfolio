import { Resend } from "resend";
import { env, hasEmail } from "../config/env";

export const resend = hasEmail ? new Resend(env.RESEND_API_KEY) : null;
