import * as THREE from 'three'
import Experience from '../../Experience'
import vertexShader from '../../Shaders/Laser/vertex.glsl'
import fragmentShader from '../../Shaders/Laser/fragment.glsl'

export default class LaserMaterial {
    constructor(length) {
        this.experience = new Experience()
        this.resources = this.experience.resources

        this.noiseTexture = this.resources.items.noiseTexture
        this.noiseTexture.wrapS = THREE.RepeatWrapping
        this.noiseTexture.wrapT = THREE.RepeatWrapping
        this.noiseTexture.flipY = false

        this.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
            vertexShader,
            fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_length: { value: length },
                u_texture: { value: this.noiseTexture },
                u_speed: { value: -1.0 },
                u_brightness: { value: 1.0 },
                u_color: { value: new THREE.Vector3(0.6, 0.3, 0) }
            }
        })
    }

    getMaterial() {
        return this.material;
    }
}