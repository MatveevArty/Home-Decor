/**
 * Получаемые данные с успешного запроса на выход в систему
 */
export type LoginResponseType = {
  accessToken: string;
  refreshToken: string;
  userId: string;
}
