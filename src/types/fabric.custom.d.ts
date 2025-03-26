import 'fabric';

declare module 'fabric' {
  namespace fabric {
    namespace Image {
      namespace filters {
        class Hue extends BaseFilter {
          constructor(options?: { hue?: number });
          hue: number;
        }

        class Exposure extends BaseFilter {
          constructor(options?: { exposure?: number });
          exposure: number;
        }

        class Opacity extends BaseFilter {
          constructor(options?: { opacity?: number });
          opacity: number;
        }
      }
    }
    interface IHueFilter extends IBaseFilter {
      /**
       * Applies filter to canvas element
       * @param canvasEl Canvas element to apply filter to
       */
      applyTo(canvasEl: HTMLCanvasElement): void;
    }
    interface IExposureFilter extends IBaseFilter {
      /**
       * Applies filter to canvas element
       * @param canvasEl Canvas element to apply filter to
       */
      applyTo(canvasEl: HTMLCanvasElement): void;
    }
    interface IOpacityFilter extends IBaseFilter {
      /**
       * Applies filter to canvas element
       * @param canvasEl Canvas element to apply filter to
       */
      applyTo(canvasEl: HTMLCanvasElement): void;
    }
    interface IAllFilters {
      Hue: {
        new(options?: {
          /**
           * Value to brighten the image up (0..255)
           * @default 0
           */
          hue: number;
        }): IHueFilter;
        /**
         * Returns filter instance from an object representation
         * @param object Object to create an instance from
         */
        fromObject(object: any): IHueFilter;
      };
      Exposure: {
        new(options?: {
          /**
           * Value to brighten the image up (0..255)
           * @default 0
           */
          exposure: number;
        }): IOpacityFilter;
        /**
         * Returns filter instance from an object representation
         * @param object Object to create an instance from
         */
        fromObject(object: any): IOpacityFilter;
      };
      Opacity: {
        new(options?: {
          /**
           * Value to brighten the image up (0..255)
           * @default 0
           */
          opacity: number;
        }): IExposureFilter;
        /**
         * Returns filter instance from an object representation
         * @param object Object to create an instance from
         */
        fromObject(object: any): IExposureFilter;
      };
    }
  }
}
