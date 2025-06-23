import { Collisions } from "../enum/Collisions.js"
import { Game } from "../Game.js"
import { Entity } from '../models/Entity.js'
import { CollisionsType } from "../types/CollisionsType.js"
import { DirectionType } from '../types/DirectionType.js'
import { MoveEntityData } from "../types/MoveEntityData.js"

export class Collider {
  game: Game
  entityStates: Record<number, CollisionsType> = {} // the key is the entity IDs

  constructor(game: Game) {
    this.game = game

    game.entities.map(entity => {
      this.entityStates[ entity.id ] = { top: [], right: [], bottom: [], left: [] }
    })
  }

  checkCollision(data: MoveEntityData) {
    const { entity: entityMoving, actionType } = data

    const directions: DirectionType[] = [ 'top', 'right', 'bottom', 'left' ]

    const aux: CollisionsType = {
      top: [],
      right: [],
      bottom: [],
      left: []
    };

    this.game.entities.forEach(entity => {
      if (entity.id === entityMoving.id) return;

      directions.forEach(dir => {

        const collision = this.checkSpecificCollision(dir, entityMoving, entity)
        if (collision) {
          aux[ dir ].push(collision)
        }
      })
    })

    this.entityStates[ entityMoving.id ] = aux
    entityMoving.collisions = { ...aux }
    const hasCollision = Object.values(aux).find(s => s.length)

    if (hasCollision) {
      this.game.notifyCollision(entityMoving, actionType as DirectionType, this.entityStates[ entityMoving.id ])
    }
  }

  checkSpecificCollision(direction: DirectionType, entity1: Entity, entity2: Entity) {
    //console.log('checando colisão');

    const { area: area1 } = entity1;
    const { area: area2 } = entity2;

    // Verifica sobreposição geral
    const overlapX = !(area1.x[ 1 ] < area2.x[ 0 ] || area1.x[ 0 ] > area2.x[ 1 ]);
    const overlapY = !(area1.y[ 1 ] < area2.y[ 0 ] || area1.y[ 0 ] > area2.y[ 1 ]);

    if (!overlapX || !overlapY) {
      return
    }; // Sem colisão relevante

    const createReturn = (collisionType: Collisions) => ({
      target: entity2,
      collisionType
    })

    const epsilon = 1

    const isContact = (a: number, b: number) => Math.abs(a - b) < epsilon

    type AreaType = {
      x: number[]
      y: number[]
    }

    type CheckersReturnType = {
      condition: boolean
      contact: boolean
      impact: boolean
    }

    const directionCheckers:
      Record<
        DirectionType,
        (a1: AreaType, a2: AreaType) => CheckersReturnType
      > = {
      bottom: (area1, area2) => ({
        condition: area1.x[ 1 ] > area2.x[ 0 ] && area1.x[ 0 ] < area2.x[ 1 ], // sobreposição horizontal
        contact: isContact(area1.y[ 1 ], area2.y[ 0 ]), // borda inferior com borda superior
        impact:
          area1.y[ 0 ] < area2.y[ 0 ] && // vindo de cima
          area1.y[ 1 ] > area2.y[ 0 ] && // cruzou a borda
          area1.y[ 0 ] < area2.y[ 1 ],   // ainda dentro da altura
      }),

      top: (area1, area2) => ({
        condition: area1.x[ 1 ] > area2.x[ 0 ] && area1.x[ 0 ] < area2.x[ 1 ], // sobreposição horizontal
        contact: isContact(area1.y[ 0 ], area2.y[ 1 ]), // borda superior com borda inferior
        impact:
          area1.y[ 1 ] > area2.y[ 1 ] && // vindo de baixo
          area1.y[ 0 ] < area2.y[ 1 ] && // cruzou a borda
          area1.y[ 1 ] > area2.y[ 0 ],   // ainda dentro da altura
      }),

      right: (area1, area2) => ({
        condition: area1.y[ 1 ] > area2.y[ 0 ] && area1.y[ 0 ] < area2.y[ 1 ], // sobreposição vertical
        contact: isContact(area1.x[ 1 ], area2.x[ 0 ]), // borda direita com borda esquerda
        impact:
          area1.x[ 0 ] < area2.x[ 0 ] && // vindo da esquerda
          area1.x[ 1 ] > area2.x[ 0 ] && // cruzou a borda
          area1.x[ 0 ] < area2.x[ 1 ],   // ainda dentro da largura
      }),

      left: (area1, area2) => ({
        condition: area1.y[ 1 ] > area2.y[ 0 ] && area1.y[ 0 ] < area2.y[ 1 ], // sobreposição vertical
        contact: isContact(area1.x[ 0 ], area2.x[ 1 ]), // borda esquerda com borda direita
        impact:
          area1.x[ 1 ] > area2.x[ 1 ] && // vindo da direita
          area1.x[ 0 ] < area2.x[ 1 ] && // cruzou a borda
          area1.x[ 1 ] > area2.x[ 0 ],   // ainda dentro da largura
      }),
    };

    const { condition, contact, impact } = directionCheckers[ direction ](area1, area2)

    if (condition) {
      if (contact) return createReturn(Collisions.CONTACT)
      if (impact) return createReturn(Collisions.IMPACT)
    }

    const completelyInside =
      area1.x[ 0 ] >= area2.x[ 0 ] &&
      area1.x[ 1 ] <= area2.x[ 1 ] &&
      area1.y[ 0 ] <= area2.y[ 0 ] &&
      area1.y[ 1 ] >= area2.y[ 1 ]

    if (completelyInside) return createReturn(Collisions.ENGULFED)

    return null
  }

  getEntityState(entityId: number) {
    return this.entityStates[ entityId ]
  }
}