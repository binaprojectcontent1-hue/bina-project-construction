import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

export interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  let cleaned = hex.replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('');
  }
  const int = parseInt(cleaned.slice(0, 6), 16) || 0;
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = uSizeRandomness == 0.0
      ? uBaseSize
      : (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / max(length(mvPos.xyz), 0.01);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    if (uAlphaParticles < 0.5) {
      if (d > 0.5) discard;
      gl_FragColor = vec4(vColor + 0.15 * sin(uv.yxx + uTime + vRandom.y * 6.28), 0.85);
    } else {
      float circle = smoothstep(0.5, 0.35, d) * 0.85;
      gl_FragColor = vec4(vColor + 0.15 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export function Particles({
  particleCount = 140,
  particleSpread = 10,
  speed = 0.12,
  particleColors = ['#ffffff', '#F68A0A', '#FABC6A', '#38BDF8'],
  moveParticlesOnHover = true,
  particleHoverFactor = 0.8,
  alphaParticles = true,
  particleBaseSize = 80,
  sizeRandomness = 1.2,
  cameraDistance = 20,
  disableRotation = false,
  className = '',
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    try {
      renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch {
      // Gracefully return if WebGL is unavailable
      return;
    }

    const gl = renderer.gl;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.pointerEvents = 'none';
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15, near: 0.01, far: 100 });
    camera.position.z = cameraDistance;

    const resize = () => {
      if (!container || !renderer) return;
      const width = container.offsetWidth || window.innerWidth;
      const height = container.offsetHeight || window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: (gl.canvas.width || width) / (gl.canvas.height || height || 1) });
    };
    resize();
    window.addEventListener('resize', resize);

    const count = particleCount;
    const position = new Float32Array(count * 3);
    const random = new Float32Array(count * 4);
    const color = new Float32Array(count * 3);
    const parsedColors = (particleColors.length > 0 ? particleColors : ['#ffffff']).map(hexToRgb);

    for (let i = 0; i < count; i++) {
      position.set([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], i * 3);
      random.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const c = parsedColors[Math.floor(Math.random() * parsedColors.length)];
      color.set(c, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: position },
      random: { size: 4, data: random },
      color: { size: 3, data: color },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!moveParticlesOnHover || !container) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / (rect.width || 1) - 0.5) * particleHoverFactor;
      mouseY = ((e.clientY - rect.top) / (rect.height || 1) - 0.5) * particleHoverFactor;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let time = 0;
    const update = () => {
      animId = requestAnimationFrame(update);
      time += speed * 0.01;
      program.uniforms.uTime.value = time;

      if (!disableRotation) {
        mesh.rotation.x = moveParticlesOnHover ? -mouseY * 0.3 : Math.sin(time * 0.5) * 0.1;
        mesh.rotation.y = moveParticlesOnHover ? mouseX * 0.3 : Math.cos(time * 0.5) * 0.1;
      }

      renderer?.render({ scene: mesh, camera });
    };
    update();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    particleColors,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
}

export default Particles;
