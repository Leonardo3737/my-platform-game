import { Entity } from "../entities/Entity.js"
import { Collisions } from "../enum/Collisions.js"
import { DirectionType } from './DirectionType.js'

export type CollisionType = { target: Entity, collisionType: Collisions }
export type CollisionsType = Record<DirectionType, CollisionType[]>