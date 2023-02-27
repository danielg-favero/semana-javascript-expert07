import CardsController from "./../controllers/cardsController.js"
import CardsView from "./../views/cardsView.js"
import CardsService from "./../services/cardsService.js"

const cardsListWorker = new Worker(`./src/workers/cardsListWorker.js`, { type: "module" })

const [rootPath] = window.location.href.split('/pages/')

const factory = {
  async initalize() {
    return CardsController.initialize({
      view: new CardsView(),
      service: new CardsService({ 
        dbUrl: `${rootPath}/assets/database.json` ,
        cardsListWorker: cardsListWorker
      })
    })
  }
}

export default factory