import "https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js"
import "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js"
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js"
import "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js"

import Service from "./service.js"

// No processo principal é usado o window
// No worker é usado o self
debugger
const { tf, faceLandmarksDetection } = self

tf.setBackeng('webgl')

onmessage = ({ data }) => {
    console.log('worker', data)

    postMessage({
        response: 'OK'
    })
} 