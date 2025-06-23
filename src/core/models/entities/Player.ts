import { ItemsIcon } from '../../constants/ItemsIcon.js';
import { Action } from "../../types/Action.js";
import { ActionType } from '../../types/ActionType.js';
import { DirectionType } from '../../types/DirectionType.js';
import { ItemsType } from '../../types/ItemsType.js';
import { MeassureType } from "../../types/MeassureType.js";
import { Item } from './../items/Item.js';
import { MovableEntity } from "./MovableEntity.js";
import { Tree } from './Tree.js';

export class Player extends MovableEntity {
  life = 5
  //velocity = 10 // 10
  points = 0
  isJumping = false
  isTakingDamage = false
  items: Partial<Record<ItemsType, number>> = {}
  openInventory = false

  actions: Partial<Record<Action, { type: ActionType, run: () => void }>> = {
    top: {
      type: 'movement',
      run: () => this.jump(),
    },
    left: {
      type: 'movement',
      run: () => this.walk('left'),
    },
    right: {
      type: 'movement',
      run: () => this.walk('right'),
    },
    hit: {
      type: 'action',
      run: () => this.hit(),
    },
    toggleInventory: {
      type: 'action',
      run: () => this.toggleInventory(),
    }
  }

  movements = {
    top: () => ({ ...this.position, y: this.position.y - this.velocity }),
    left: () => ({ ...this.position, x: this.position.x - this.velocity }),
    bottom: () => ({ ...this.position, y: this.position.y + this.velocity }),
    right: () => ({ ...this.position, x: this.position.x + this.velocity }),
  }

  constructor(
    body: CanvasRenderingContext2D,
    position: MeassureType,
    size: MeassureType,
  ) {
    super(
      body,
      position,
      size,
      '#00B7EB',
      'player',
    )
  }

  jump() {
    if (this.isSuspended || this.isJumping) return

    let jumpFrame = 0
    const totalFrames = 20
    this.isSuspended = true
    this.isJumping = true

    const intervalId = setInterval(() => {
      if (jumpFrame < totalFrames && this.canMove('top')) {
        this.hide()
        this.position = { ...this.position, y: this.position.y - 2 }
        jumpFrame++
      }
      else {
        clearInterval(intervalId)
        this.isJumping = false
      }

      this.notifyMovement({ actionType: 'top', endMovement: true })
      this.render()
    }, 10)
  }

  hit() {
    let tree: unknown = undefined

    for (let direction in this.collisions) {
      this.collisions[ direction as DirectionType ].forEach(collision => {
        const collidedObject = collision.target

        if (collidedObject instanceof Tree) {
          tree = collidedObject
          return
        }
      })
    }

    if (!(tree instanceof Tree)) {
      return
    }
    tree.takeDamage()
  }

  override mayFall(): boolean {
    return this.usesGravity && !this.isJumping;
  }

  collectedItem(item: Item) {
    this.items[ item.itemType ] = (this.items[ item.itemType ] || 0) + 1;
  }

  toggleInventory() {
    const inventory = document.getElementById('inventory') as HTMLDivElement;

    if (!inventory) return

    if (this.openInventory) {
      inventory.style.display = 'none';
      inventory.innerHTML = '';
    }
    else {
      const renderItems = (item: ItemsType, quantity: number) => `
      <div class="item">
      ${ItemsIcon[ item ] || ''}
      <div class="count">x${quantity}</div>
      <div class="options">
        <button>Largar</button>
      </div>
    </div>
      `
      let hasItems = false;
      for (let item in this.items) {
        const itemType = item as ItemsType;
        const quantity = this.items[ itemType ];
        if (quantity) {
          hasItems = true;
          inventory.innerHTML += renderItems(itemType, quantity);
        }
      }
      if (!hasItems) {
        inventory.innerHTML = '<div class="empty">Nenhum item coletado</div>';
      }
      inventory.style.display = 'grid';
    }

    this.openInventory = !this.openInventory;
  }

}