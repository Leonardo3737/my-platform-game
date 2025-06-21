import { Entity } from "../entities/Entity.js"
import { MovableEntity } from "../entities/MovableEntity.js"
import { Player } from "../entities/Player.js"
import { Collisions } from "../enum/Collisions.js"
import { Game } from "../Game.js"
import { CollisionsType } from "../types/CollisionsType.js"
import { Collider } from "./Collider.js"

export class Gravity {
  velocity = 1
  game: Game
  collider: Collider
  fallingEntities: Record<number, boolean> = {}

  constructor(
    game: Game,
    collider: Collider
  ) {
    this.game = game
    this.collider = collider
    this.checkFallCondition()
  }

  isToFall = (collisionType: CollisionsType) => !collisionType.bottom.length || !collisionType.bottom.find(c => c.collisionType === Collisions.CONTACT)
  /* entityMayFall = (entity: Entity) =>
    entity.usesGravity &&
    (
      (
        !(entity instanceof Player) &&
        entity instanceof MovableEntity) ||
      (
        entity instanceof Player &&
        !entity.isJumping
      )
    ) */

  checkFallCondition() {
    this.game.entities.forEach(entity => {

      if (!entity.mayFall()) return

      const collisionType = this.collider.getEntityState(entity.id)

      if (!collisionType.bottom.length) {
        this.pushDown(entity as MovableEntity)
      }
    });
  }

  checkSpecificFallCondition(entity: Entity) {
    if (!entity.mayFall()) {
      return
    }

    const collisionType = this.collider.getEntityState(entity.id)

    if (this.isToFall(collisionType)) {
      this.pushDown(entity as MovableEntity)
    } else if (entity.isSuspended) {
      entity.isSuspended = false
    }
  }

  pushDown(entity: MovableEntity) {

    if (this.fallingEntities[entity.id]) return
    entity.isSuspended = true
    this.fallingEntities[entity.id] = true

    let auxVelocity = 10;

    const fallLoop = () => {
      if (auxVelocity > 4) {
        auxVelocity--;
      }

      if (this.fallingEntities[entity.id]) {
        const collisionType = this.collider.getEntityState(entity.id);
        this.fallingEntities[entity.id] = this.isToFall(collisionType);

        if (!this.isToFall(collisionType)) {
          entity.isSuspended = false;
          return; // Encerra sem chamar novamente
        }

        entity.hide();
        entity.lastPosition = {...entity.position}
        entity.position = { ...entity.position, y: entity.position.y + this.velocity };
        entity.notifyMovement({
          direction: 'bottom',
          endMovement: true,
          isGravity: true
        });
        entity.render()

        setTimeout(fallLoop, auxVelocity); // Chamada recursiva com intervalo atualizado
      } else {
        entity.isSuspended = false;
      }
    };

    fallLoop();
  }
}