// Color palette for different levels
const levelColors = [
  '#2E86AB', // Level 0 - Root (Blue)
  '#A23B72', // Level 1 - Districts (Purple)
  '#F18F01', // Level 2 - Churches (Orange)
  '#C73E1D', // Level 3 (Red)
  '#3B1F2B', // Level 4 (Dark)
];

const linkColors = [
  '#86BBD8', // Level 0 links (Light Blue)
  '#DA7B93', // Level 1 links (Light Purple)
  '#F9C784', // Level 2 links (Light Orange)
  '#F4A259', // Level 3 links (Light Red)
  '#666666', // Level 4 links (Gray)
];

export const getNodeColor = (depth: number): string => {
  return levelColors[Math.min(depth, levelColors.length - 1)];
};

export const getLinkColor = (depth: number): string => {
  return linkColors[Math.min(depth, linkColors.length - 1)];
};