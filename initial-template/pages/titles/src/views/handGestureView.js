export default class HandGestureView {
    loop(fn) {
        requestAnimationFrame(fn)
    }

    scrollPage(top) {
        console.log({ top })
        scroll({
            top,
            behavior: 'smooth'
        })
    }
}