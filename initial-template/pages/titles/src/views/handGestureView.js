export default class HandGestureView {
    #canvas = document.querySelector('#hands')
    #canvasContext = this.#canvas.getContext('2d')
    #fingerLookupIndices
    #styler

    constructor({ fingerLookupIndices, styler }){
        this.#canvas.width = globalThis.screen.availWidth
        this.#canvas.height = globalThis.screen.availHeight
        this.#fingerLookupIndices = fingerLookupIndices
        this.#styler = styler

        setTimeout(() => styler.loadDocumentStyles(), [200])
    }

    clearCanvas(){
        this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    }

    drawResults(hands){
        for(const { keypoints, handedness } of hands) {
            if(!keypoints) continue

            this.#canvasContext.fillStyle = "rgb(44, 212, 103)"
            this.#canvasContext.strokeStyle = "white"
            this.#canvasContext.lineWidth = 8
            this.#canvasContext.lineJoin = "round"

            this.#drawJoints(keypoints)
            this.#drawFingerAndHoverElements(keypoints)
        }
    }

    #drawJoints(keypoints) {
        for(const { x, y } of keypoints) {
            this.#canvasContext.beginPath()

            const newX = x - 2
            const newY = y - 2
            const radius = 3
            const startAngle = 0
            const endAngle = 2 * Math.PI

            this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle)
            this.#canvasContext.fill()
        }
    }

    #drawFingerAndHoverElements(keypoints){
        const fingers = Object.keys(this.#fingerLookupIndices)

        for(const finger of fingers) {
            const points = this.#fingerLookupIndices[finger].map(index => keypoints[index])

            const region = new Path2D()
            // [0] é a palma da mão
            const [{ x, y }] = points
            region.moveTo(x, y)
            for(const point of points) {
                region.lineTo(point.x, point.y)
            }

            this.#canvasContext.stroke(region)
            this.#hoverElements(finger, points)
        }
    }

    #hoverElements(finger, points) {
        if(finger !== 'indexFinger') return

        const fingerTip = points.find(item => item.name === 'index_finger_tip')

        const element = document.elementFromPoint(fingerTip.x, fingerTip.y)
        if(!element) return

        const fn = () => this.#styler.toggleStyle(element, ':hover')

        fn()
        setTimeout(() => fn(), 500)
    }

    clickOnElement(x, y) {
        const element = document.elementFromPoint(x, y)

        if(!element) return

        const rect = element.getBoundingClientRect()
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: rect.left + x,
            clientY: rect.top + y
        })

        element.dispatchEvent(event)
    }

    loop(fn) {
        requestAnimationFrame(fn)
    }

    scrollPage(top) {
        scroll({
            top,
            behavior: 'smooth'
        })
    }
}