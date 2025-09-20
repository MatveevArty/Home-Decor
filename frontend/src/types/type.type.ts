/**
 * Получаемые данные с успешного запроса на типы продуктов
 */
export type TypeType = {
  id: string,
  name: string,
  category: {
    id: string,
    name: string,
    url: string
  },
  url: string
}
