import { getDB } from "@/db/client";
import { users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq, or } from "drizzle-orm";
import { mightFail } from "might-fail";

export interface AuthenticatedUser {
  kindeId: string;
  dbId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const { getUser, isAuthenticated } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) return null;

  const kindeUser = await getUser();
  if (!kindeUser?.id) return null;

  const db = getDB();

  const { error: selectError, result } = await mightFail(
    db
      .select()
      .from(users)
      .where(
        or(
          eq(users.kindeId, kindeUser.id),
          eq(users.email, kindeUser.email ?? "")
        )
      )
      .limit(1)
  );

  if (selectError) {
    console.error("Database error checking for user:", selectError);
    return null;
  }

  if (result && result.length > 0) {
    const dbUser = result[0];

    if (dbUser.kindeId !== kindeUser.id) {
      await mightFail(
        db
          .update(users)
          .set({ kindeId: kindeUser.id })
          .where(eq(users.id, dbUser.id))
      );
    }

    return {
      kindeId: kindeUser.id,
      dbId: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      picture: dbUser.picture,
    };
  }

  const { error: insertError, result: insertResult } = await mightFail(
    db
      .insert(users)
      .values({
        kindeId: kindeUser.id,
        email: kindeUser.email ?? "",
        first_name: kindeUser.given_name ?? null,
        last_name: kindeUser.family_name ?? null,
        picture: kindeUser.picture ?? null,
      })
      .returning()
  );

  if (insertError || !insertResult || insertResult.length === 0) {
    console.error("Failed to create user:", insertError);
    return null;
  }

  const newUser = insertResult[0];
  return {
    kindeId: kindeUser.id,
    dbId: newUser.id,
    email: newUser.email,
    firstName: newUser.first_name,
    lastName: newUser.last_name,
    picture: newUser.picture,
  };
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
