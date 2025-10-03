/**
 * Получаемые данные о товарах в Избранное
 */
export type FavoriteType = {
  id: string,
  name: string,
  url: string,
  image: string,
  price: number,
  countInCart?: number,
}
