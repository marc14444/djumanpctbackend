import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const myEmail = "djuman0225@gmail.com";
const appName = "DJUMAN";

// Configuration du transporteur (SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: myEmail,
    pass: process.env.EMAIL_PASSWORD_SECRET,
  },
});

// Fonction d'envoi d'email de Bienvenue
export const welcomeEmail = (toEmail) => {
  const mailOptions = {
    from: myEmail,
    to: toEmail,
    subject: `Bienvenue sur ${appName}`,
    
    html: `
      <html>
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
      </head>
      <body>
        <div class="container">
          <h1 class="display-4">Bienvenue sur ${appName}}</h1>
          <p class="lead">Merci de vous être inscrit sur ${appName}". Nous sommes ravis de vous avoir parmi nous!</p>
          <a href="#" class="btn btn-primary">Read More</a>
        </div>
      </body>
    </html>
      `,
  };

  return transporter.sendMail(mailOptions);
};

// Fonction d'envoi d'email pour le code
export const codeEmail = (toEmail, code) => {
  const mailOptions = {
    from: myEmail,
    to: toEmail,
    subject: "Code de validation",
    html: `
      <div>
      <h1>${appName}</h1>
      <h2>Votre code de validation est : </h2>
      <span style="color: #fcbe24; font-weight: bold; font-size: 2em; height:40px; width:200px; text-align: center; background-color:black; display:grid; place-items: center;"
      >${code}</span
    >
      </div>    
      `,
  };

  return transporter.sendMail(mailOptions);
};

// Fonction d'envoi d'email pour le code de mot de passe oublié
export const codeForgotPassword = (toEmail, code) => {
  const mailOptions = {
    from: myEmail,
    to: toEmail,
    subject: "Code confirmation pour mot de passe oublié",
    html: `
      <div>
      <h1>${appName}</h1>
      <h2>Votre code de confirmation est : </h2>
      <span style="color: #fcbe24; font-weight: bold; font-size: 2em; height:40px; width:200px; text-align: center; background-color:black; display:grid; place-items: center;"
      >${code}</span>
      </div>`,
  };

  return transporter.sendMail(mailOptions);
};
