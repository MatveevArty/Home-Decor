/**
 * Обработанные данные категории с наполняющими её типами
 */
export type CategoryWithTypeType = {
  id: string;
  name: string;
  url: string;
  types: {
    id: string;
    name: string;
    url: string;
  }[];
}
