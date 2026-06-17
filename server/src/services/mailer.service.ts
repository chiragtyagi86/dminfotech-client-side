import net from "net";
import tls from "tls";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type SmtpResponse = {
  code: number;
  message: string;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw Object.assign(new Error(`${name} is required to send email.`), { status: 500 });
  }
  return value;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readResponse(socket: net.Socket | tls.TLSSocket): Promise<SmtpResponse> {
  return new Promise((resolve, reject) => {
    let buffer = "";

    function onData(chunk: Buffer) {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1];
      if (/^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), message: buffer });
      }
    }

    function onError(err: Error) {
      cleanup();
      reject(err);
    }

    function cleanup() {
      socket.off("data", onData);
      socket.off("error", onError);
    }

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function command(socket: net.Socket | tls.TLSSocket, line: string, expected: number[]) {
  socket.write(`${line}\r\n`);
  const response = await readResponse(socket);
  if (!expected.includes(response.code)) {
    throw Object.assign(new Error(`SMTP command failed: ${response.message}`), { status: 502 });
  }
  return response;
}

function connectPlain(host: string, port: number) {
  return new Promise<net.Socket>((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => resolve(socket));
    socket.once("error", reject);
  });
}

function connectTls(host: string, port: number) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const socket = tls.connect({ host, port, servername: host }, () => resolve(socket));
    socket.once("error", reject);
  });
}

function upgradeToTls(socket: net.Socket, host: string) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const secure = tls.connect({ socket, servername: host }, () => resolve(secure));
    secure.once("error", reject);
  });
}

function buildMime({ to, subject, html, text }: MailOptions) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "DM Infotech <no-reply@dmifotech.com>";
  const boundary = `dm-${Date.now().toString(36)}`;
  const safeSubject = subject.replace(/\r?\n/g, " ");

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${safeSubject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    text || stripHtml(html),
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    html,
    "",
    `--${boundary}--`,
    ".",
    "",
  ].join("\r\n");
}

export async function sendMail(options: MailOptions) {
  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const fromAddress = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "no-reply@dmifotech.com";

  let socket: net.Socket | tls.TLSSocket = secure
    ? await connectTls(host, port)
    : await connectPlain(host, port);

  try {
    const greeting = await readResponse(socket);
    if (greeting.code !== 220) throw new Error(greeting.message);

    await command(socket, `EHLO ${process.env.SMTP_HELO || "dmifotech.com"}`, [250]);

    if (!secure && process.env.SMTP_STARTTLS !== "false") {
      await command(socket, "STARTTLS", [220]);
      socket = await upgradeToTls(socket as net.Socket, host);
      await command(socket, `EHLO ${process.env.SMTP_HELO || "dmifotech.com"}`, [250]);
    }

    if (user && pass) {
      await command(socket, "AUTH LOGIN", [334]);
      await command(socket, Buffer.from(user).toString("base64"), [334]);
      await command(socket, Buffer.from(pass).toString("base64"), [235]);
    }

    await command(socket, `MAIL FROM:<${fromAddress}>`, [250]);
    await command(socket, `RCPT TO:<${options.to}>`, [250, 251]);
    await command(socket, "DATA", [354]);
    socket.write(buildMime(options));
    const accepted = await readResponse(socket);
    if (accepted.code !== 250) {
      throw Object.assign(new Error(`SMTP send failed: ${accepted.message}`), { status: 502 });
    }
    await command(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

export function renderCareerApplicationEmail(input: {
  candidateName: string;
  jobTitle: string;
  statusLabel?: string;
  message: string;
}) {
  const candidateName = escapeHtml(input.candidateName || "Candidate");
  const jobTitle = escapeHtml(input.jobTitle || "the role");
  const statusLabel = input.statusLabel ? escapeHtml(input.statusLabel) : "Application Update";
  const paragraphs = escapeHtml(input.message)
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${statusLabel}</title>
  </head>
  <body style="margin:0;background:#f5f0eb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#2f3348;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #eadfd7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#3a405a;padding:28px 32px;">
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f9dec9;">DM Infotech</div>
          <h1 style="margin:10px 0 0;font-family:Georgia,serif;font-size:30px;line-height:1.15;font-weight:400;color:#ffffff;">${statusLabel}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:30px 32px 8px;">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">Dear ${candidateName},</p>
          <div style="font-size:15px;line-height:1.8;color:#3f4358;">${paragraphs}</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:26px 0;background:#fdfaf8;border:1px solid #efe5dd;border-radius:12px;">
            <tr>
              <td style="padding:16px 18px;">
                <div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#8b786d;margin-bottom:6px;">Position</div>
                <div style="font-size:16px;color:#2f3348;font-weight:700;">${jobTitle}</div>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#3f4358;">Warm regards,<br><strong>Team DM Infotech</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px 26px;border-top:1px solid #f0e7df;color:#8b786d;font-size:12px;line-height:1.6;">
          This is an official communication from DM Infotech. Please reply to this email if you need any clarification.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
