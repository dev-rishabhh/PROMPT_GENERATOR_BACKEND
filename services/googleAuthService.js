import { OAuth2Client } from "google-auth-library";

const CLIENT_ID=process.env.CLIENT_ID

const client = new OAuth2Client({
  CLIENT_ID,
});

export async function verifyIdToken(idToken) {
  const loginTicket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });

  const userData = loginTicket.getPayload();
  return userData;
}