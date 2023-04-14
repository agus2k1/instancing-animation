const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    varying float vSpeed;

    uniform float uTime;
    uniform sampler2D uSprite;

    void main() {
        float time = vSpeed * uTime * 6.;

        vec2 offset = vec2(
            mod(floor(time), 5.),
            4. - floor(mod(time / 5., 5.))
        );

        vec2 uv1 = vUv / 5. + offset / 5.;

        vec4 texture = texture2D(uSprite, uv1);

        gl_FragColor = texture;
    }
`;

export default fragmentShader;
