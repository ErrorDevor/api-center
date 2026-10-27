import nodemailer from "nodemailer";

const NAME_MAX_LENGTH = 120;
const WEBSITE_MAX_LENGTH = 300;
const CONTACT_MAX_LENGTH = 200;
const COMMENT_MAX_LENGTH = 3000;

const readField = (value: unknown, maxLength: number): string | null =>
   typeof value === "string" && value.trim().length <= maxLength ? value.trim() : null;

// POST /api/provider-requests — emails an "Add provider" request to
// PROVIDER_REQUESTS_TO through SMTP (see .env.example). Open to anonymous
// visitors, so every field is length-capped and nothing is echoed back.
export async function POST(request: Request): Promise<Response> {
   let body: unknown;

   try {
      body = await request.json();
   } catch {
      return Response.json({ message: "Invalid request body" }, { status: 400 });
   }

   const raw = (body ?? {}) as Record<string, unknown>;
   const name = readField(raw.name, NAME_MAX_LENGTH);
   const website = readField(raw.website, WEBSITE_MAX_LENGTH);
   const contact = readField(raw.contact, CONTACT_MAX_LENGTH);
   const comment = readField(raw.comment ?? "", COMMENT_MAX_LENGTH);

   if (!name || !website || !contact || comment === null) {
      return Response.json({ message: "Name, website and contact are required" }, { status: 400 });
   }

   const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, PROVIDER_REQUESTS_TO } =
      process.env;

   if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !PROVIDER_REQUESTS_TO) {
      console.error("provider-requests: SMTP_* / PROVIDER_REQUESTS_TO are not configured");

      return Response.json({ message: "Mail is not configured" }, { status: 503 });
   }

   const port = Number(SMTP_PORT) || 465;

   try {
      const transport = nodemailer.createTransport({
         host: SMTP_HOST,
         port,
         secure: port === 465,
         auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transport.sendMail({
         from: SMTP_FROM || SMTP_USER,
         to: PROVIDER_REQUESTS_TO,
         subject: `Add provider request: ${name}`,
         text: [
            `Provider: ${name}`,
            `Website: ${website}`,
            `Contact: ${contact}`,
            "",
            comment || "(no comment)",
         ].join("\n"),
      });
   } catch (error) {
      console.error("provider-requests: sending failed", error);

      return Response.json({ message: "Could not send the request" }, { status: 502 });
   }

   return Response.json({ ok: true });
}
