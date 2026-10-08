export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
    colors: { ink: '#0F1B33', paper: '#F5F7FB', brand: { DEFAULT: '#3B4CCA', dark: '#2E3CA8', soft: '#E8EBFB' }, mint: { DEFAULT: '#1FA68A', soft: '#DDF4EE' }, amber: { DEFAULT: '#F2A93B', soft: '#FDF1DC' } },
  } },
};
