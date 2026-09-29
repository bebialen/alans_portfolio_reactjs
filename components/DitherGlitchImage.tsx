import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DitherGlitchImageProps {
  imageSrc?: string;
  className?: string;
  onAnimationComplete?: () => void;
  autoPlay?: boolean;
}

export type AnimationPhase = 'dithering' | 'glitching' | 'restored';

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_dither_mix;     // 1.0 = full dither, 0.0 = clean original
  uniform float u_glitch_mix;     // 0.0 to 1.0 glitch intensity
  uniform float u_pixel_size;     // pixel block scale
  uniform float u_color_depth;    // color quantization depth

  varying vec2 v_texCoord;

  // 4x4 Bayer Matrix
  float getBayer4(vec2 pos) {
    vec2 p = mod(pos, 4.0);
    int x = int(p.x);
    int y = int(p.y);
    float m = 0.0;
    if (y == 0) {
      if (x == 0) m = 0.0; else if (x == 1) m = 8.0; else if (x == 2) m = 2.0; else m = 10.0;
    } else if (y == 1) {
      if (x == 0) m = 12.0; else if (x == 1) m = 4.0; else if (x == 2) m = 14.0; else m = 6.0;
    } else if (y == 2) {
      if (x == 0) m = 3.0; else if (x == 1) m = 11.0; else if (x == 2) m = 1.0; else m = 9.0;
    } else {
      if (x == 0) m = 15.0; else if (x == 1) m = 7.0; else if (x == 2) m = 13.0; else m = 5.0;
    }
    return m / 16.0;
  }

  // 8x8 Bayer Matrix computed from 4x4
  float getBayer8(vec2 pos) {
    vec2 p = mod(pos, 8.0);
    vec2 p4 = mod(p, 4.0);
    float b4 = getBayer4(p4);
    vec2 quadrant = floor(p / 4.0);
    float qOffset = 0.0;
    if (quadrant.x == 0.0 && quadrant.y == 0.0) qOffset = 0.0;
    else if (quadrant.x == 1.0 && quadrant.y == 0.0) qOffset = 2.0;
    else if (quadrant.x == 0.0 && quadrant.y == 1.0) qOffset = 3.0;
    else qOffset = 1.0;
    return b4 * 0.75 + (qOffset / 4.0) * 0.25;
  }

  // Pseudo-random generator
  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_texCoord;

    // --- GLITCH HORIZONTAL SLICE DISPLACEMENT ---
    if (u_glitch_mix > 0.001) {
      float sliceY = floor(uv.y * 28.0 + sin(u_time * 15.0) * 3.0);
      float sliceNoise = rand(vec2(sliceY, floor(u_time * 20.0)));
      if (sliceNoise > 0.55) {
        float displacement = (rand(vec2(sliceY, 7.31)) - 0.5) * 0.22 * u_glitch_mix;
        uv.x = clamp(uv.x + displacement, 0.0, 1.0);
      }
      
      // Secondary fine-grain jitter
      float fineNoise = rand(vec2(floor(uv.y * 90.0), floor(u_time * 40.0)));
      if (fineNoise > 0.82) {
        uv.x = clamp(uv.x + (fineNoise - 0.82) * 0.08 * u_glitch_mix, 0.0, 1.0);
      }
    }

    // --- CHROMATIC ABERRATION (RGB SPLIT) ---
    float splitDist = 0.035 * u_glitch_mix;
    vec2 uvR = clamp(uv + vec2(splitDist, 0.0), 0.0, 1.0);
    vec2 uvG = uv;
    vec2 uvB = clamp(uv - vec2(splitDist, 0.0), 0.0, 1.0);

    vec4 sampleR = texture2D(u_image, uvR);
    vec4 sampleG = texture2D(u_image, uvG);
    vec4 sampleB = texture2D(u_image, uvB);

    vec4 cleanColor = vec4(sampleR.r, sampleG.g, sampleB.b, sampleG.a);

    // --- COLOURED DITHER SHADER ---
    vec2 pixelCoord = floor(uv * u_resolution / u_pixel_size);
    vec2 ditherUV = clamp(pixelCoord * u_pixel_size / u_resolution, 0.0, 1.0);
    vec4 ditherSample = texture2D(u_image, ditherUV);

    float bayerVal = getBayer8(pixelCoord);
    float threshold = bayerVal - 0.5;

    // Multi-channel colored dithering with color depth quantization
    float levels = u_color_depth;
    vec3 ditherRGB;
    ditherRGB.r = floor(clamp(ditherSample.r + threshold / levels, 0.0, 1.0) * levels + 0.5) / levels;
    ditherRGB.g = floor(clamp(ditherSample.g + threshold / levels, 0.0, 1.0) * levels + 0.5) / levels;
    ditherRGB.b = floor(clamp(ditherSample.b + threshold / levels, 0.0, 1.0) * levels + 0.5) / levels;

    // Vibrant cyberpunk color grading for dithered look
    vec3 stylizedDither = ditherRGB * vec3(1.08, 1.04, 1.18);
    
    // Subtle CRT scanline texture
    float scanline = sin(uv.y * u_resolution.y * 1.2) * 0.06 * u_dither_mix;
    stylizedDither = clamp(stylizedDither - scanline, 0.0, 1.0);

    vec4 ditherColor = vec4(stylizedDither, ditherSample.a);

    // Blend between dither shader and clean image
    vec4 outputColor = mix(cleanColor, ditherColor, u_dither_mix);

    // --- GLITCH DIGITAL STATIC / ARTIFACTS ---
    if (u_glitch_mix > 0.05) {
      float staticNoise = rand(uv * 100.0 + vec2(u_time * 30.0, u_time * 50.0));
      if (staticNoise > 0.92) {
        outputColor.rgb += vec3(0.3, 0.5, 0.9) * u_glitch_mix;
      }

      // Cyber cyan/magenta scan-band
      float band = sin(uv.y * 20.0 + u_time * 25.0);
      if (band > 0.75) {
        outputColor.rgb = mix(outputColor.rgb, vec3(0.2, 0.85, 1.0), 0.35 * u_glitch_mix);
      }
    }

    gl_FragColor = outputColor;
  }
`;

export const DitherGlitchImage: React.FC<DitherGlitchImageProps> = ({
  imageSrc = '/projectimages/profile/alans_profile_image.png',
  className = '',
  onAnimationComplete,
  autoPlay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  // WebGL context and uniform locations
  const glContextRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    texture: WebGLTexture;
    uniforms: {
      u_resolution: WebGLUniformLocation | null;
      u_time: WebGLUniformLocation | null;
      u_dither_mix: WebGLUniformLocation | null;
      u_glitch_mix: WebGLUniformLocation | null;
      u_pixel_size: WebGLUniformLocation | null;
      u_color_depth: WebGLUniformLocation | null;
    };
  } | null>(null);

  const triggerGlitchReplay = useCallback(() => {
    startTimeRef.current = performance.now();
    setReplayCount(prev => prev + 1);
  }, []);

  // Initialize WebGL and Load Texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: true });
    if (!gl) {
      console.warn('WebGL not supported, fallback to standard image render');
      setHasError(true);
      return;
    }

    // Compile Shader helper
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) {
      setHasError(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setHasError(true);
      return;
    }

    gl.useProgram(program);

    // Quad geometry covering full clip space (-1 to 1) with UV coordinates (0 to 1)
    const vertices = new Float32Array([
      // Pos X, Pos Y,   UV X, UV Y
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_position = gl.getAttribLocation(program, 'a_position');
    const a_texCoord = gl.getAttribLocation(program, 'a_texCoord');

    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(a_texCoord);
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 16, 8);

    // Uniform locations
    const uniforms = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_dither_mix: gl.getUniformLocation(program, 'u_dither_mix'),
      u_glitch_mix: gl.getUniformLocation(program, 'u_glitch_mix'),
      u_pixel_size: gl.getUniformLocation(program, 'u_pixel_size'),
      u_color_depth: gl.getUniformLocation(program, 'u_color_depth'),
    };

    // Load texture
    const texture = gl.createTexture();
    if (!texture) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      glContextRef.current = {
        gl,
        program,
        texture,
        uniforms,
      };

      setImageLoaded(true);
      if (autoPlay) {
        startTimeRef.current = performance.now();
      }
    };

    img.onerror = () => {
      console.error('Failed to load profile image from:', imageSrc);
      setHasError(true);
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imageSrc, autoPlay]);

  // Main Render & Animation Loop
  useEffect(() => {
    if (!imageLoaded || !glContextRef.current) return;

    const { gl, program, uniforms } = glContextRef.current;
    let completedTriggered = false;

    // Timeline Configuration (in ms):
    // Phase 1: 0ms -> 1800ms (Coloured Dither Shader)
    // Phase 2: 1800ms -> 3000ms (Intense Glitch Transition)
    // Phase 3: 3000ms+ (Restored to 100% Original Unfiltered Image)
    const DITHER_DURATION = 1800;
    const GLITCH_DURATION = 1200;
    const TOTAL_TRANSITION = DITHER_DURATION + GLITCH_DURATION;

    const render = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Adjust canvas resolution to display size with device pixel ratio
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.round(rect.width * dpr);
      const displayHeight = Math.round(rect.height * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      // Animation parameters calculation
      let ditherMix = 1.0;
      let glitchMix = 0.0;

      if (elapsed < DITHER_DURATION) {
        // Phase 1: Pure Coloured Dither Shader
        ditherMix = 1.0;
        glitchMix = 0.0;
      } else if (elapsed < TOTAL_TRANSITION) {
        // Phase 2: Glitch Transition Effect
        const glitchProgress = (elapsed - DITHER_DURATION) / GLITCH_DURATION;
        
        if (glitchProgress < 0.3) {
          glitchMix = (glitchProgress / 0.3) * 0.9;
          ditherMix = 1.0;
        } else if (glitchProgress < 0.7) {
          glitchMix = 0.9 + Math.sin(now * 0.05) * 0.1;
          ditherMix = 1.0 - (glitchProgress - 0.3) / 0.4;
        } else {
          glitchMix = (1.0 - (glitchProgress - 0.7) / 0.3) * 0.8;
          ditherMix = 0.0;
        }
      } else {
        // Phase 3: Original Unfiltered Version Restored
        ditherMix = 0.0;
        glitchMix = 0.0;

        if (!completedTriggered) {
          completedTriggered = true;
          onAnimationComplete?.();
        }
      }

      // Set Uniforms
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_time, elapsed / 1000.0);
      gl.uniform1f(uniforms.u_dither_mix, ditherMix);
      gl.uniform1f(uniforms.u_glitch_mix, glitchMix);
      gl.uniform1f(uniforms.u_pixel_size, 3.5);
      gl.uniform1f(uniforms.u_color_depth, 6.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (elapsed < TOTAL_TRANSITION + 200 || glitchMix > 0.001) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        gl.uniform1f(uniforms.u_dither_mix, 0.0);
        gl.uniform1f(uniforms.u_glitch_mix, 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imageLoaded, replayCount, onAnimationComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <div 
        className="relative h-[270px] sm:h-[330px] aspect-[415/601] rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-[0_12px_40px_rgba(0,0,0,0.6)] cursor-pointer group transition-all duration-300 hover:border-blue-500/50"
        onClick={triggerGlitchReplay}
        title="Click to replay dither & glitch effect"
      >
        {/* WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
        />

        {/* Fallback image if WebGL fails */}
        {hasError && (
          <img
            src={imageSrc}
            alt="Alan Profile"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

export default DitherGlitchImage;
