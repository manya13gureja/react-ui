'use client';
import { useEffect, useRef } from 'react';

// Particle shader: animated, noisy, blurred, dark blue-gradient particles
const particleFragShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 1.2;
    // Animate noise field vertically and horizontally
    float n = noise(st * 8.0 + vec2(t * 0.2, t * 0.5));
    float n2 = noise(st * 16.0 - vec2(t * 0.3, t * 0.1));
    float mask = smoothstep(0.45, 0.55, n) * 0.7 + smoothstep(0.35, 0.65, n2) * 0.3;
    // Gradient for particles: dark blue to blue
    vec3 colorA = vec3(0.22, 0.32, 0.60); // dark blue (not deep)
    vec3 colorB = vec3(0.32, 0.44, 0.78); // lighter blue
    vec3 color = mix(colorA, colorB, st.y);
    // Add noisy, blurred effect
    float blur = smoothstep(0.0, 0.15, abs(n2 - 0.5));
    color = mix(color, vec3(0.18, 0.22, 0.38), blur * 0.3);
    gl_FragColor = vec4(color, 0.7 * mask * blur); // semi-transparent, blurred
  }
`;

// Glassy gradient shader: blurry, animated, light pink-blue linear gradient
const glassFragShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    // Animated linear gradient angle
    float angle = 0.35 + 0.15 * sin(u_time * 0.1);
    float grad = st.x * cos(angle) + st.y * sin(angle);
    // Pink-blue gradient
    vec3 colorA = vec3(0.95, 0.80, 0.8); // light pink
    vec3 colorB = vec3(0.80, 0.92, 1.0); // light blue
    vec3 color = mix(colorA, colorB, grad);
    // Add a little animation
    color += 0.03 * sin(u_time + st.xyx * 8.0);
    gl_FragColor = vec4(color, 0.85); // glassy, slightly opaque
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile error');
  }
  return shader;
}
function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Program link error');
  }
  return program;
}
const vertexShader = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

function useWebGLBackground(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  fragShader: string,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;
    const program = createProgram(gl, vertexShader, fragShader);
    gl.useProgram(program);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    let animationId: number;
    let start = performance.now();
    function resize() {
      if (!canvas || !gl) return;
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);
    function render() {
      if (!gl || !canvas) return;
      const now = performance.now();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    }
    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [canvasRef, fragShader]);
}

export default function AnimatedNoiseBackground() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const glassCanvasRef = useRef<HTMLCanvasElement>(null);
  useWebGLBackground(particleCanvasRef, particleFragShader);
  useWebGLBackground(glassCanvasRef, glassFragShader);
  return (
    <>
      {/* Particle layer (bottom) */}
      <canvas
        ref={particleCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 1,
          filter: 'blur(4px)',
          background: 'transparent',
        }}
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* Glassy gradient layer (top) */}
      <canvas
        ref={glassCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 1,
          filter: 'blur(2px)',
          background: 'transparent',
        }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </>
  );
}
