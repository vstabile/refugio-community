import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const getNip05Json = functions.https.onRequest(async (req, res) => {
  const name = req.query.name as string;

  if (!name) {
    res.status(400).json({ error: "Missing 'name' query parameter" });
    return;
  }

  try {
    const nip05Doc = await db.collection("nip-05").doc(name).get();

    if (!nip05Doc.exists) {
      res.status(404).json({ error: "Name not found" });
      return;
    }

    const nip05Data = nip05Doc.data();
    const npub = nip05Data?.["name"];

    res.json({
      names: {
        [name]: npub,
      },
    });
  } catch (error) {
    console.error("Error fetching nip-05 data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
