export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export const responsive = {
  mobile: `@media (max-width: ${breakpoints.sm}px)`,
  tablet: `@media (max-width: ${breakpoints.md}px)`,
  desktop: `@media (min-width: ${breakpoints.lg}px)`,
};

export const containerSizes = {
  xs: '100%',
  sm: '540px',
  md: '720px',
  lg: '960px',
  xl: '1140px',
};