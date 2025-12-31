import { getDB } from "@/db/client";
import { users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { mightFail } from "might-fail";

const db = getDB();

export async function insertUserInDatabase() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser) {
    throw new Error("No Kinde user found in session");
  }

  const { error: selectError, result: selectResult } = await mightFail(
    db.select().from(users).where(eq(users.kindeId, kindeUser.id)).limit(1)
  );
  if (selectError) {
    throw new Error(
      "Database error while checking for existing user: " + selectError.message
    );
  }
  if (selectResult && selectResult.length > 0) {
    return selectResult[0];
  }

  const { error: insertError, result: insertResult } = await mightFail(
    db
      .insert(users)
      .values({
        kindeId: kindeUser.id,
        email: kindeUser.email || "",
        first_name: kindeUser.given_name || null,
        last_name: kindeUser.family_name || null,
        picture: kindeUser.picture || null,
      })
      .returning()
  );
  if (insertError) {
    throw new Error(
      "Database error while creating user: " + insertError.message
    );
  }

  return insertResult ? insertResult[0] : null;
}
