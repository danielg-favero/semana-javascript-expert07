import { gestureStrings, knownGestures } from "../util/gestures.js"

export default class HandGestureService {
    #gestureEstimator
    #handPoseDetection
    #handsVersion
    #detector = null

    constructor({
        fingerPose,
        handPoseDetection,
        handsVersion
    }){
        this.#gestureEstimator = new fingerPose.GestureEstimator(knownGestures)
        this.#handPoseDetection = handPoseDetection
        this.#handsVersion = handsVersion
    }

    async initializeDetector() {
        if(this.#detector) return

        const detectorConfig = {
            runtime: 'mediapipe',
            solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
            // Full: mais pesado e mais preciso
            // Lite: mais leve
            modelType: 'lite',
            maxHands: 2
        }

        this.#detector = await handPoseDetection.createDetector(
            this.#handPoseDetection.SupportedModels.MediaPipeHands, 
            detectorConfig
        )

        return this.#detector
    }

    async estimate(keypoints3D){
        const predictions = await this.#gestureEstimator.estimate(
            this.#getLandmarksFromKeypoints(keypoints3D),
            9 // porcentagem de confiança de 90% de certeza que é um gesto
        )
        return predictions.gestures
    }

    async * detectGestures(predictions) {
        for(const hand of predictions) {
            if(!hand.keypoints3D) continue

            const gestures = await this.estimate(hand.keypoints3D)
            if(!gestures.length) continue

            const result = gestures.reduce((previous, current) => (p.score > current.score) ? previous : current)

            const { x, y } = hand.keypoints.find(keypoint => keypoint.name === 'index_finger_tip')

            yield { event: result.name, x, y }
        }
    }

    #getLandmarksFromKeypoints(keypoints3D) {
        return keypoints3D.map(keypoint => [
            keypoint.x,
            keypoint.y,
            keypoint.z
        ])
    }

    async estimateHands(video) {
        return this.#detector.estimateHands(video, {
            flipHorizontal: true
        })
    }
}