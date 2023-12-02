
import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nanoid from "nanoid";
import { CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET, JWT_SECRET, SENDGRID_KEY } from "../config.js";
  
 import * as  cloudinary from 'cloudinary';
const expressJwt = require('express-jwt');

// Inclure la bibliothèque Brevo
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configurer la clé API
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = SENDGRID_KEY; // Remplacez par votre clé API Brevo
// Instancier l'API des e-mails
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// // sendgrid
// require("dotenv").config();
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey.SENDGRID_KEY;

// CLOUDINARY
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET
})


// middleware
exports.requireSignin = expressJwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
});

export const signup = async (req, res) => {
  console.log("HIT SIGNUP");
  try {
    // validation
    const { name, email, password, phone } = req.body;
    if (!name) {
      return res.json({
        error: "Entez votre nom",
      });
    }
    if (!email) {
      return res.json({
        error: "Entrez votre email",
      });
    }

    if (!phone) {
      return res.json({
        error: "Entrez votre numero de telephone",
      });
    }
    if (!password || password.length < 8) {
      return res.json({
        error: "Le mot de passe doit comporteren moins 8 caractères",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "L'e-mail est pris",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        name,
        email,
        phone,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      //   console.log(user);
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Trouver l'utilisateur par e-mail
  const user = await User.findOne({ email });
  console.log("USER ===> ", user);
  if (!user) {
    return res.json({ error: "Utilisateur non trouvé" });
  }
  // Générer le code
  const resetCode = nanoid(6).toUpperCase();
  // Enregistrer dans la base de données
  user.resetCode = resetCode;
  user.save();
  // Préparer l'e-mail
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "Code de réinitialisation du mot de passe";
  sendSmtpEmail.htmlContent = `<h1>Votre code de réinitialisation de mot de passe est: <br> ${resetCode}</h1>`;
  sendSmtpEmail.sender = { "name": "SwapZone", "email": "contact@swapzone.com" };
  sendSmtpEmail.to = [{ "name": user.name, "email": user.email }];

  // Envoyer l'e-mail avec Brevo
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('E-mail envoyé avec succès. Données retournées : ' + JSON.stringify(data));
    res.json({ ok: true });
  }).catch(function (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail : ' + error);
    res.json({ ok: false });
  });
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

exports.uploadImage = async (req, res) => {
  // console.log('Upload Image => user_id', req.user._id);

  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: nanoid(),
      resource_type: "jpg",
    })
    console.log('CLOUDINARY RESPONSE> ', result);

    const user = await User.findByIdAndUpdate(
      req.user._id, {
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    },
      { new: true }
    );
    // Send response

    return res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })
  } catch (error) {
    console.log(error);
  }
};


exports.updatePassword = async (req, res) => {

  try {
    const { password } = req.body;
    if (password && password.length < 6) {
      return res.json({
        error: 'Le mot de passe doit contenir au moin 6 caractères'
      })
    } else {
      // update db
      const hashedPassword = await hashPassword(password);
      const user = await User.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });
      user.password = undefined;
      user.secret = undefined;
      return res.json(user)
    }
  } catch (err) {
    console.log(err);
  }
};




 