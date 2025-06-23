import { DirectionType } from '../../types/DirectionType.js';
import { ItemsType } from '../../types/ItemsType.js';
import { MeassureType } from '../../types/MeassureType.js';
import { Entity } from '../Entity.js';

export abstract class Item extends Entity {
  itemType: ItemsType
  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
    size: MeassureType,
    color: string,
    itemType: ItemsType,
  ) {
    super(
      body,
      position,
      size,
      color,
      'item',
      false,
      true
    )
    this.itemType = itemType;
  }

  canMove(direction: DirectionType) {
    return false;
  }
}