export class Control {
  observes: ((key: string) => void)[] = []
  intervalIds: Record<string, NodeJS.Timeout> = {}

  constructor() {
    document.addEventListener('keydown', (event) => this.onKeyDown(event))
    document.addEventListener('keyup', (event) => this.onKeyUp(event))
  }

  getFormattedKey = (event: KeyboardEvent) => event.key.toUpperCase()

  onKeyDown(event: KeyboardEvent) {
    
    const key = this.getFormattedKey(event)
    if(this.intervalIds[key]) return    

    this.intervalIds[key] = setInterval(() => {
      this.notifyAll(key)
    }, 10)
  }
  
  onKeyUp(event: KeyboardEvent) {
    const key = this.getFormattedKey(event)
    if(this.intervalIds[key]) {
      clearInterval(this.intervalIds[key])
      delete this.intervalIds[key]
    }
  }


  subscribe(callback: (key: string) => void) {
    this.observes.push(callback)
  }

  notifyAll(key: string) {

    this.observes.forEach(observe => observe(key))
  }
}