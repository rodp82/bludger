export interface JwtPayload {
  thirdPartyId?: string,
  provider?: string,
  iat?: number,
  exp?: number
}
