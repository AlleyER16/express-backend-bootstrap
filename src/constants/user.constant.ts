export enum eUserSessionLogoutTypes {
  EXPIRED = "expired", // Session expires

  PASSWORD_CHANGE = "password-change", // When user changes password
  PASSWORD_RESET = "password-reset", // When user resets password - Forgot password process
  NEW_LOGIN = "new-login", // When a new login is initiated (One session per user)
  DEACTIVATE_ACCOUNT = "deactivate-account", // When a user deactivates account

  LOGOUT = "logout", // When a user logs out
}
