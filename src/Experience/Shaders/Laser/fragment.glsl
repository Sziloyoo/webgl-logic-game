uniform float u_time;
uniform float u_speed;
uniform float u_length;
uniform float u_brightness;
uniform vec3 u_color;
uniform sampler2D u_texture;
varying vec2 v_uv;

void main() {
    vec4 texColor = texture2D(u_texture, vec2(v_uv.x, (v_uv.y * u_length) + u_speed * u_time));
    vec3 color = u_color * u_brightness;
    gl_FragColor = vec4(texColor.rgb * color, texColor.a);
}