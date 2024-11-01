uniform sampler2D atlas;
uniform sampler2D mask;
uniform vec2 tileCount;

varying vec2 vUv;

vec4 sampleTile(vec2 tileIndex, vec2 uv) {
    vec2 tileSize = 1.0 / tileCount;
    vec2 tileUv = tileSize * tileIndex + uv * tileSize;
    return texture2D(atlas, tileUv);
}

void main() {
    vec4 maskColor = texture2D(mask, vUv);
    vec4 tex1 = sampleTile(vec2(0.0, 0.0), vUv);
    vec4 tex2 = sampleTile(vec2(1.0, 0.0), vUv);
    vec4 tex3 = sampleTile(vec2(0.0, 1.0), vUv);
    vec4 tex4 = sampleTile(vec2(1.0, 1.0), vUv);

    vec4 finalColor = tex1 * maskColor.r +
        tex2 * maskColor.g +
        tex3 * maskColor.b +
        tex4 * maskColor.a;

    gl_FragColor = finalColor;
}