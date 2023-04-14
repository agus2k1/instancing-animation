const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vSpeed;

  uniform float uTime;

  attribute float aOffset;
  attribute float aSpeed;

  void main() {
    vUv = uv;
    vSpeed = aSpeed;

    vec3 newPosition = position;

    newPosition.xy -= - 2. + mod(uTime / 5. + aOffset * 7., 7.) * aSpeed;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4( newPosition, 1. );
    gl_PointSize = 0.1 * ( 1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export default vertexShader;
