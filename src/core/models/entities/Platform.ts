import { ScreenSize } from "../../constants/ScreenSize.js"
import { MeassureType } from "../../types/MeassureType.js"
import { Entity } from "./../Entity.js"

export class Platform extends Entity {

  constructor(
    body: CanvasRenderingContext2D,
    position: Omit<MeassureType, 'y'> & Partial<Pick<MeassureType, 'y'>>,
    size: MeassureType,
    color: string
  ) {
    const auxPosition = {
      x: position.x,
      y: position.y ?? (ScreenSize.y - size.y) / 5
    }

    super(
      body,
      auxPosition,
      size,
      color,
      'platform',
      false
    )
  }
  canMove() {
    return false
  }
}