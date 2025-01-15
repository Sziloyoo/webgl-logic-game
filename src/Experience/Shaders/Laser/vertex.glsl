varying vec2 v_uv;
void main() {
  v_uv = uv; // Pass UV coordinates to the fragment shader
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}