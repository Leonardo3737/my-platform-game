export class Control {
  observesKeyDown: ((key: string) => void)[] = []
  observesKeyPress: ((key: string) => void)[] = []
  intervalIds: Record<string, NodeJS.Timeout> = {}

  constructor() {
    document.addEventListener('keydown', (event) => this.onKeyDown(event))
    document.addEventListener('keyup', (event) => this.onKeyUp(event))
    document.addEventListener('keypress', (event) => this.onKeyPress(event))
  }

  getFormattedKey = (event: KeyboardEvent) => event.key.toUpperCase()

  onKeyDown(event: KeyboardEvent) {

    const key = this.getFormattedKey(event)
    if (this.intervalIds[ key ]) return

    this.intervalIds[ key ] = setInterval(() => {
      this.notifyAllKeyDown(key)
    }, 10)
  }

  onKeyUp(event: KeyboardEvent) {
    const key = this.getFormattedKey(event)
    if (this.intervalIds[ key ]) {
      clearInterval(this.intervalIds[ key ])
      delete this.intervalIds[ key ]
    }
  }

  onKeyPress(event: KeyboardEvent) {
    const key = this.getFormattedKey(event)
    this.notifyAllKeyPress(key)
  }

  subscribe(type: 'keydown' | 'keypress', callback: (key: string) => void) {
    if (type === 'keypress') {
      this.observesKeyPress.push(callback)
    } else if (type === 'keydown') {
      this.observesKeyDown.push(callback)
    }
  }

  notifyAllKeyDown(key: string) {
    this.observesKeyDown.forEach(observe => observe(key))
  }

  notifyAllKeyPress(key: string) {
    this.observesKeyPress.forEach(observe => observe(key))
  }
}