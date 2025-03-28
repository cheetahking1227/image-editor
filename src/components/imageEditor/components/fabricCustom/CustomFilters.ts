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
    uniform float uExposure;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      color.rgb *= pow(2.0, uExposure); // simulate exposure compensation
      gl_FragColor = color;
    }
  `,

  /**
   * Exposure value, typically in EV (Exposure Value) steps.
   * 0 = no change, positive = brighter, negative = darker
   */
  exposure: 0,

  mainParameter: 'exposure',

  initialize: function (options?: fabric.IObjectOptions) {
    options = options || {};
    this.callSuper("initialize", options);
  },

  isNeutralState: function () {
    return this.exposure === 0;
  },

  applyTo2d: function (options: any) {
    if (this.exposure === 0) return;

    const imageData = options.imageData;
    const data = imageData.data;
    const len = data.length;
    const exposureFactor = Math.pow(2, this.exposure);

    for (let i = 0; i < len; i += 4) {
      data[i] = data[i] * exposureFactor;     // R
      data[i + 1] = data[i + 1] * exposureFactor; // G
      data[i + 2] = data[i + 2] * exposureFactor; // B
    }
  },
});

// Opacity Filter
fabric.Image.filters.Opacity = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type: 'Opacity',



  /**
   * Fragment shader for WebGL rendering
   */
  fragmentSource: 'precision highp float;\n' +
    'uniform sampler2D uTexture;\n' +
    'uniform float uOpacity;\n' +
    'varying vec2 vTexCoord;\n' +
    'void main() {\n' +
    'vec4 color = texture2D(uTexture, vTexCoord);\n' +
    'color.a *= uOpacity;\n' +
    'gl_FragColor = color;\n' +
    '}',

  /**
   * Opacity value, from 0 (transparent) to 1 (opaque)
   * @type Number
   * @default
   */
  opacity: 1,

  /**
   * Main parameter name
   */
  mainParameter: 'opacity',

  initialize: function (
    options?: fabric.IObjectOptions
  ) {
    options = options || {};
    this.callSuper("initialize", options);
    fabric.filterBackend = new fabric.Canvas2dFilterBackend();
  },

  isNeutralState: function () {
    return this.opacity === 1;
  },

  /**
   * Apply opacity on 2D canvas (non-WebGL)
   * @param {Object} options
   */
  applyTo2d: function (options: any) {
    if (this.opacity >= 1) {
      return;
    }
    var imageData = options.imageData,
      data = imageData.data,
      i, len = data.length;

    for (i = 0; i < len; i += 4) {
      data[i + 3] = data[i + 3] * this.opacity;
    }
  }
});
