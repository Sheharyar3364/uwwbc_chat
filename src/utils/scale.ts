import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on iphone 11
const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

const scale = (size: any) =>
  width > 600
    ? (width / guidelineBaseWidth) * size * 0.61
    : (width / guidelineBaseWidth) * size;
const scaleVertical = (size: any) => (height / guidelineBaseHeight) * size;
const scaleModerate = (size: any, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export { scale, scaleVertical, scaleModerate };
