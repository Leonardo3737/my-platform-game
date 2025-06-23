import { Collisions } from "../enum/Collisions.js"
import { Entity } from "../models/Entity.js"
import { DirectionType } from './DirectionType.js'

export type CollisionType = { target: Entity, collisionType: Collisions }
export type CollisionsType = Record<DirectionType, CollisionType[]>