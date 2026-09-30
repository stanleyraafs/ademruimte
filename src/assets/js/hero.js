// Levende hero: rollende mist, rimpelend water en glinsteringen via WebGL.
// Zonder WebGL of met "minder beweging" blijft de gewone foto (met CSS-mist) staan.
(() => {
  const hero = document.querySelector(".hero");
  const media = hero && hero.querySelector(".hero__media");
  const img = media && media.querySelector("img");
  if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Databesparing aan: geen WebGL, de foto met CSS-mist blijft staan
  if (navigator.connection && navigator.connection.saveData) return;

  const canvas = document.createElement("canvas");
  canvas.className = "hero__canvas";
  canvas.setAttribute("aria-hidden", "true");
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
  if (!gl) return;

  const VERT = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAG = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif
    uniform sampler2D uImg;
    uniform vec2 uRes;      // canvasgrootte in pixels
    uniform vec2 uImgSize;  // fotogrootte in pixels
    uniform vec2 uPos;      // object-position (0..1)
    uniform float uTime;
    uniform float uBreath;  // 0..1, 4 tellen in / 6 tellen uit
    uniform vec2 uMouse;    // -1..1
    uniform vec2 uFocus;    // midden van de long (schermcoordinaten 0..1)

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
      return v;
    }

    void main() {
      vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
      float aspect = uRes.x / uRes.y;
      float t = uTime;

      // object-fit: cover
      float scale = max(uRes.x / uImgSize.x, uRes.y / uImgSize.y);
      vec2 drawn = uImgSize * scale;
      vec2 iuv = (uv * uRes - (uRes - drawn) * uPos) / drawn;

      // Water herkennen aan de kleur: turquoise (veel blauw t.o.v. rood, blauw ~ groen)
      vec3 base = texture2D(uImg, iuv).rgb;
      float water = smoothstep(0.10, 0.24, base.b - base.r) * smoothstep(0.74, 0.92, base.b / max(base.g, 0.001));

      // Rimpelingen
      vec2 wp = iuv * vec2(uImgSize.x / uImgSize.y, 1.0) * 26.0;
      vec2 disp = vec2(noise(wp + vec2(t * 0.35, t * 0.22)) - 0.5,
                       noise(wp * 1.3 + vec2(-t * 0.27, t * 0.31) + 7.0) - 0.5);
      vec3 col = texture2D(uImg, iuv + disp * 0.0035 * water).rgb;

      // Fijne zonneglinsteringen op het water + trage caustics
      float sp = noise(wp * 5.0 + vec2(t * 1.2, -t * 0.8)) * noise(wp * 7.3 - vec2(t * 0.9, t * 1.1));
      float lum = dot(base, vec3(0.3, 0.55, 0.15));
      col += vec3(1.0, 0.97, 0.86) * smoothstep(0.6, 0.88, sp) * (0.25 + 0.5 * lum) * water;
      col *= 1.0 + (noise(wp * 0.45 + t * 0.18) - 0.5) * 0.16 * water;

      // Rollende mist in twee lagen (schermruimte, met parallax op de muis).
      // De achterste laag drijft trager dan de voorste: dat geeft diepte.
      vec2 fp = uv * vec2(aspect, 1.0) * 1.35;
      vec2 wind = vec2(t * 0.05, t * 0.012);
      float q = fbm(fp * 1.1 + vec2(t * 0.03, -t * 0.02) - uMouse * 0.03);
      float back = fbm(fp + wind * 0.6 + q * 1.5 - uMouse * 0.05);
      float front = fbm(fp * 1.9 + wind * 1.5 + vec2(13.1, 4.7) + q * 0.8 - uMouse * 0.14);
      float fogBack = smoothstep(0.42, 0.8, back);
      float fogFront = smoothstep(0.5, 0.8, front);
      // Lichtval: waar de mist richting de zon (linksboven) dunner wordt, licht hij op
      float towardSun = fbm(fp * 1.9 + wind * 1.5 + vec2(13.1, 4.7) + q * 0.8 - uMouse * 0.14 + vec2(-0.06, -0.05));
      float lit = clamp((front - towardSun) * 6.0, -1.0, 1.0);

      // Minder mist boven de long, meer aan de randen; de mist "ademt" mee
      vec2 c = (uv - uFocus) * vec2(aspect, 1.0);
      float edge = smoothstep(0.12, 0.75, length(c * vec2(0.85, 1.25)));
      float density = mix(0.3, 1.0, edge) * (0.75 + 0.4 * uBreath);

      // Warm licht in de mist aan de zonkant (linksboven)
      vec3 fogCol = mix(vec3(0.9, 0.95, 0.92), vec3(1.0, 0.95, 0.82), smoothstep(1.0, 0.0, length(uv)));
      // Mist dempt het beeld eronder een beetje (luchtperspectief) en licht het op
      col = mix(col, fogCol * 0.92, clamp(fogBack * density, 0.0, 1.0) * 0.55);
      vec3 frontCol = fogCol * (0.9 + 0.18 * lit);
      col = mix(col, frontCol, clamp(fogFront * density, 0.0, 1.0) * 0.72);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    return; // geen WebGL-effect; de foto blijft gewoon staan
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  ["uImg", "uRes", "uImgSize", "uPos", "uTime", "uBreath", "uMouse", "uFocus"].forEach((n) => (u[n] = gl.getUniformLocation(prog, n)));

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(u.uImg, 0);

  let imgSize = [1, 1];
  let loadedSrc = "";
  let ready = false;

  function loadTexture() {
    const src = img.currentSrc || img.src;
    if (!src || src === loadedSrc) return;
    loadedSrc = src;
    const source = new Image();
    source.decoding = "async";
    source.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
      imgSize = [source.naturalWidth, source.naturalHeight];
      if (!ready) {
        ready = true;
        hero.classList.add("has-gl");
      }
    };
    source.src = src;
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // Telefoons en tablets: 30 beelden per seconde. De mist beweegt traag, dus je ziet het verschil niet; de batterij wel.
  const minFrameMs = coarse ? 32 : 0;
  let quality = 1; // zakt automatisch als het apparaat het niet bijhoudt

  function resize() {
    const rect = media.getBoundingClientRect();
    // Beperk de resolutie: de bronfoto is ± 1500 px breed en mist is zacht
    const maxPixels = (coarse ? 1.1e6 : 2.4e6) * quality;
    let ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    if (rect.width * rect.height * ratio * ratio > maxPixels) ratio = Math.sqrt(maxPixels / (rect.width * rect.height));
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);

    const pos = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
    gl.uniform2f(u.uPos, isNaN(pos[0]) ? 0.5 : pos[0], isNaN(pos[1]) ? 0.5 : pos[1]);
    // Staand scherm: de long zit hoger in beeld
    const portrait = window.matchMedia("(max-width: 860px) and (max-aspect-ratio: 4/5)").matches;
    gl.uniform2f(u.uFocus, 0.5, portrait ? 0.3 : 0.4);
    loadTexture();
  }

  // Muis-parallax, zacht uitgevloeid
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
  });

  // Zelfde ritme als de CSS-ademhaling: 4 s in, 6 s uit
  const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x);
  function breath(ms) {
    const phase = (ms / 1000) % 10;
    return phase < 4 ? ease(phase / 4) : 1 - ease((phase - 4) / 6);
  }

  let visible = true;
  let raf = 0;
  let last = 0, slow = 0, frames = 0;
  function frame(now) {
    raf = 0;
    if (!visible) return;
    if (ready && last && now - last < minFrameMs) {
      raf = requestAnimationFrame(frame);
      return;
    }
    if (ready) {
      // Adaptieve kwaliteit: bij aanhoudend trage frames de resolutie verlagen
      if (last && document.visibilityState === "visible") {
        frames++;
        if (now - last > 40) slow++;
        if (frames === 90) {
          if (slow > 45 && quality > 0.5) {
            quality *= 0.6;
            resize();
          }
          frames = slow = 0;
        }
      }
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform2f(u.uImgSize, imgSize[0], imgSize[1]);
      gl.uniform1f(u.uTime, (now / 1000) % 3600);
      gl.uniform1f(u.uBreath, breath(now));
      gl.uniform2f(u.uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!raf) raf = requestAnimationFrame(frame); };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(hero);

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    hero.classList.remove("has-gl");
    visible = false;
  });

  media.appendChild(canvas);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  if (img.complete) resize();
  else img.addEventListener("load", resize, { once: true });
  resize();
  start();
})();
