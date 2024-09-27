const CaretIcon = ({
  fill,
  stroke,
  height,
  width,
  strokeWidth,
  className = ""
}) => (
  <svg
    width={width ? width : "10"}
    height={height ? height : "16"}
    viewBox="0 0 10 16"
    fill={fill ? fill : "none"}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1.47459 1.0338L8.44159 7.9998L1.47459 14.9668"
      stroke={stroke ? stroke : "white"}
      strokeWidth={strokeWidth ? strokeWidth : "1.5"}
    />
  </svg>
);
export default CaretIcon;
