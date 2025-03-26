import { fabric, } from 'fabric';

// Hue Filter

fabric.Image.filters.Hue = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Hue',
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uHue;
    varying vec2 vTexCoord;

    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      float angle = uHue * 3.14159265;
      float s = sin(angle), c = cos(angle);
      mat3 hueRotation = mat3(
        vec3(.299+.701*c+.168*s, .587-.587*c+.330*s, .114-.114*c-.497*s),
        vec3(.299-.299*c-.328*s, .587+.413*c+.035*s, .114-.114*c+.292*s),
        vec3(.299-.3*c+.5*s, .587-.588*c-.2*s, .114+.886*c-.3*s)
      );
      gl_FragColor = vec4(hueRotation * color.rgb, color.a);
    }
  `,
  hue: 0,
  mainParameter: 'hue',
  applyTo2d(options: any) { },
});

// Exposure Filter
fabric.Image.filters.Exposure = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Exposure',
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float exposure;
    varying vec2 vTexCoord;

    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      gl_FragColor = vec4(color.rgb * pow(2.0, exposure), color.a);
    }
  `,
  exposure: 0,
  mainParameter: 'exposure',
  applyTo2d(options: any) { },
});

// Opacity Filter
fabric.Image.filters.Opacity = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Opacity',
  fragmentSource: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float opacity;
    varying vec2 vTexCoord;

    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      gl_FragColor = vec4(color.rgb, color.rgb * opacity);
    }
  `,
  opacity: 1,
  mainParameter: 'opacity',
  applyTo2d(options: any) { },
});
