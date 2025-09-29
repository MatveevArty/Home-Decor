import {OrderStatusType} from "../../../types/order-status.type";

export class OrderStatusUtil {

  /**
   * Запрос для определённого статуса на получение цвета и перевода статуса
   * @param status
   */
  static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {
    let name = 'Новый';
    let color = '#456F49';

    switch (status) {
      case OrderStatusType.delivery:
        name = 'Доставка';
        color = '#55b4fd';
        break;
      case OrderStatusType.cancelled:
        name = 'Отменён';
        color = '#FF7575';
        break;
      case OrderStatusType.pending:
        name = 'Обработка';
        color = '#f4e961';
        break;
      case OrderStatusType.success:
        name = 'Выполнен';
        color = '#B6D5B9';
        break;
    }

    return {name, color};
  }
}
