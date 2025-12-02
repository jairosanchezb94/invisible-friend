import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const { results, settings } = await request.json();
    const host = undefined                         ;
    const user = undefined                         ;
    const pass = undefined                         ;
    let transporter;
    if (host && user && pass) ; else {
      console.log("--- MODO SIMULACIÓN: No se han configurado variables SMTP ---");
      console.log("Para envío real configura: SMTP_HOST, SMTP_USER, SMTP_PASS");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`Cuenta de prueba Ethereal creada: ${testAccount.user}`);
    }
    const emailPromises = results.map(async (result) => {
      const info = await transporter.sendMail({
        from: '"Invisible Friend" <noreply@invisiblefriend.app>',
        to: result.email,
        subject: "🎁 Tu Amigo Invisible",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">Hola ${result.name}!</h1>
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #555;">Se ha realizado el sorteo del Amigo Invisible.</p>
              <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px;">Te ha tocado regalar a:</p>
                <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #0284c7;">${result.assignment}</p>
              </div>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-weight: bold; color: #333;">Detalles del evento:</p>
              <ul style="color: #555; line-height: 1.6;">
                <li><strong>Presupuesto:</strong> ${settings.budget}</li>
                <li><strong>Fecha:</strong> ${settings.date}</li>
                <li><strong>Notas:</strong> ${settings.details}</li>
              </ul>
              <p style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">¡Shhh! Es un secreto.</p>
            </div>
          </div>
        `
      });
      if (!host) {
        console.log(`Vista previa del correo para ${result.name}: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return info;
    });
    await Promise.all(emailPromises);
    return new Response(JSON.stringify({ success: true, message: "Correos enviados" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error enviando correos:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
