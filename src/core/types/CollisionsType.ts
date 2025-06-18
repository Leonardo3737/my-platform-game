import { Entity } from "../entities/Entity.js"
import { Collisions } from "../enum/Collisions.js"
import { DirectionType } from "./DirectionType.js"

export type CollisionsType = Record<DirectionType, {target: Entity, collisionType: Collisions}[]>