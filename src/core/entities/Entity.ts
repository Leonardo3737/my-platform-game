import { CollisionsType } from "../types/CollisionsType.js";
import { DirectionType } from "../types/DirectionType.js";
import { EntityType } from "../types/EntityType.js";
import { MeassureType } from "../types/MeassureType.js";
import { MoveEntityData } from "../types/MoveEntityData.js";

let entityIdCounter = 1;

export abstract class Entity {
  id: number
  body: CanvasRenderingContext2D
  position: MeassureType
  size: MeassureType
  color: string
  type: EntityType
  // movementObserves: ((data: MoveEntityData) => void)[] = [] // REMOVER
  collisions: CollisionsType = { top: [], right: [], bottom: [], left: [] };
  usesGravity: boolean
  isSuspended: boolean = false // remover depois

  // movements: Record<DirectionType, Function> = {} as Record<DirectionType, Function> /// REMOVER

  get area() {
    return {
      x: [this.position.x, this.position.x + this.size.x],
      y: [this.position.y, this.position.y + this.size.y]
    }
  }

  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
    size: MeassureType,
    color: string,
    type: EntityType,
    usesGravity: boolean
  ) {
    this.position = { x: position.x * 5, y: position.y * 5 }
    this.size = { x: size.x * 5, y: size.y * 5 }
    this.body = body
    this.color = color
    this.type = type
    this.usesGravity = usesGravity
    this.id = entityIdCounter++
  }

  /* movementSubscribe(event: (data: MoveEntityData) => void) {
    this.movementObserves.push(event)
  }

  notifyMovement(data: Omit<MoveEntityData, 'entity'>) {
    this.movementObserves.forEach(callback => callback({ ...data, entity: this }))
  } */

  hide() {
    this.body.clearRect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    )
  }

  render() {
    const {
      x: positionX,
      y: positionY,
    } = this.position

    const {
      x: sizeX,
      y: sizeY,
    } = this.size

    this.body.fillStyle = this.color
    this.body.fillRect(positionX, positionY, sizeX, sizeY)
  }

  mayFall(): boolean {
    return this.usesGravity;
  }

  abstract canMove(direction: DirectionType): boolean
}