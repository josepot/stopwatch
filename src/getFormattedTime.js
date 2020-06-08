// totalMilliseconds: number
export default function getFormattedTime(totalMilliseconds) {
  const totalSeconds = totalMilliseconds / 1000;
  const [minutes, seconds, centis] = [
    totalSeconds / 60,
    totalSeconds % 60,
    (totalMilliseconds % 1000) / 10,
  ].map((total) => Math.floor(total).toString(10).padStart(2, "0"));

  return `${minutes}:${seconds}.${centis}`;
}
