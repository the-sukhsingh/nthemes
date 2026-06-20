const transitions = {
  circle: {
    name: 'Circle Mask (radial expand)',
    css: `::view-transition-group(root) { 
  animation-timing-function: var(--expo-out); 
}
::view-transition-old(root), .dark::view-transition-old(root) { 
  animation: none; 
  animation-fill-mode: both;
  z-index: -1; 
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>') center / 0 no-repeat;
  animation: scale 1s;
  animation-fill-mode: both;
}
@keyframes scale { 
  to { 
    mask-size: 200vmax; 
  } 
}`
  },
  'circle-with-blur': {
    name: 'Circle Mask with Blur',
    css: `::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>') center / 0 no-repeat;
  animation: scale 1s;
  animation-fill-mode: both;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation: scale 1s;
  animation-fill-mode: both;
}
@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}`
  },
  'circle-blur-top-left': {
    name: 'Circle Blur Top Left',
    css: `::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>') top left / 0 no-repeat;
  mask-origin: content-box;
  animation: scale 1s;
  animation-fill-mode: both;
  transform-origin: top left;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 1s;
  animation-fill-mode: both;
  transform-origin: top left;
  z-index: -1;
}
@keyframes scale {
  to {
    mask-size: 350vmax;
  }
}`
  },
  polygon: {
    name: 'Polygon Reveal',
    css: `::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  animation-name: reveal-light;
  animation-fill-mode: both;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  animation-fill-mode: both;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation-name: reveal-dark;
  animation-fill-mode: both;
}
@keyframes reveal-dark {
  from {
    clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
  }
  to {
    clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
  }
}
@keyframes reveal-light {
  from {
    clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
  }
  to {
    clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
  }
}`
  },
  'polygon-gradient': {
    name: 'Polygon Gradient (Custom SVG)',
    css: `::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 1.5s;
  animation-fill-mode: both;
  z-index: -1;
  transform-origin: top left;
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H40L0 40V0Z" fill="url(%23paint0_linear_16_14)"/><defs><linearGradient id="paint0_linear_16_14" x1="0" y1="0" x2="20.5" y2="20.5" gradientUnits="userSpaceOnUse"><stop stop-color="white"/><stop offset="0.84506" stop-color="white" stop-opacity="0.99"/><stop offset="0.9506" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs></svg>') top left / 0 no-repeat;
  mask-origin: top left;
  animation: scale 1.5s;
  animation-fill-mode: both;
}
@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}`
  },
  'gif-1': {
    name: 'Shigure Ui Dance (GIF)',
    css: `::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 3s;
  animation-fill-mode: both;
}
::view-transition-new(root) {
  mask: url('https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif') center / 0 no-repeat;
  animation: scale 3s;
  animation-fill-mode: both;
}
@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}`
  },
  'gif-2': {
    name: 'I Love You Love (GIF)',
    css: `::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 2s;
  animation-fill-mode: both;
}
::view-transition-new(root) {
  mask: url('https://media.tenor.com/Jz0aSpk9VIQAAAAi/i-love-you-love.gif') center / 0 no-repeat;
  animation: scale 2s;
  animation-fill-mode: both;
}
@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}`
  }
};

const expoTimingFunctions = `:root {
  --expo-in: linear(
    0 0%, 0.0085 31.26%, 0.0167 40.94%,
    0.0289 48.86%, 0.0471 55.92%,
    0.0717 61.99%, 0.1038 67.32%,
    0.1443 72.07%, 0.1989 76.7%,
    0.2659 80.89%, 0.3465 84.71%,
    0.4419 88.22%, 0.554 91.48%,
    0.6835 94.51%, 0.8316 97.34%, 1 100%
  );
  --expo-out: linear(
    0 0%, 0.1684 2.66%, 0.3165 5.49%,
    0.446 8.52%, 0.5581 11.78%,
    0.6535 15.29%, 0.7341 19.11%,
    0.8011 23.3%, 0.8557 27.93%,
    0.8962 32.68%, 0.9283 38.01%,
    0.9529 44.08%, 0.9711 51.14%,
    0.9833 59.06%, 0.9915 68.74%, 1 100%
  );
}`;

module.exports = {
  transitions,
  expoTimingFunctions,
};
