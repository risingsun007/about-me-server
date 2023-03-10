import fetch2 from "node-fetch";
import google from 'googleapis';
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';



const app = express();
dotenv.config();
const origins =  process.env.ALLOWED_ORIGINS?.split(",") || [""]

const corsOptions = { origin: origins }
app.use(cors(corsOptions))
const port = process.env.PORT || 2999;

app.post("/getToken", async (req: any, res: any) => {
  console.log("getToken")
  if (!req?.headers?.code) {
    console.log("no code provided")
    res.send("No code provided")
    return;
  } else {
    console.log(`code: ${req.headers.code}`)
  }
  const code = req.headers.code;
  const oaut2Client = new google.Auth.OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL);
  let token: any = "";
  try {
    let result: any = await oaut2Client.getToken((code))
    token = result.tokens.id_token;

    let email: string = "";
    let emailAddresses = await fetch2(`https://www.googleapis.com/oauth2/v2/tokeninfo?id_token=${token}`)
    if (emailAddresses.ok) {

      email = (await (emailAddresses as any).json()).email;
      console.log(`emailAddresses ok: ${email}`)
    }
    res.send({ email })
  } catch (e) {
    console.log(`failed: ${e}`)
  }
  // res.send(token)
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});