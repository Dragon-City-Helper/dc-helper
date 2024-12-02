import { Session } from "next-auth";

export function isAuthorized(
  user: Session["user"],
  createdBy: string
): boolean {
  const isAuth =
    user.id === createdBy || ["ADMIN", "GOD"].includes(user.role.toUpperCase());

  if (!isAuth) {
    console.warn(`User ${user.id} with role ${user.role} is not authorized`);
  } else {
    console.log(`User ${user.id} authorized with role ${user.role}`);
  }

  return isAuth;
}
