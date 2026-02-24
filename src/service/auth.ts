let accessToken: null | string = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function getAccessToken(): null | string {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}
