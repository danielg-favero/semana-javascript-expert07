import Controller from './controller.js'
import Service from './service.js'
import View from './view.js'
import Camera from '../../../lib/shared/camera.js'

const [rootPath] = window.location.href.split('/pages/')

const worker = new Worker('./src/worker.js', { type: "module" })

const camera = await Camera.init()

const factory = {
  async initalize() {
    return Controller.initialize({
        view: new View(),
        camera,
        worker
    })
  }
}

export default factory