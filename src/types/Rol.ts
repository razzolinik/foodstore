// Roles supported by the app. An enum keeps every comparison
// (login, guard, seeding) going through the same typed values
// instead of loose "admin"/"client" strings scattered around.
export enum Rol {
  ADMIN = "admin",
  CLIENT = "client",
}
