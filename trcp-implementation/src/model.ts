export async function classifyImage() {
  const labels = ["cat", "dog", "digit-7"];
  const label = labels[Math.floor(Math.random() * labels.length)];
  const confidence = +(Math.random() * 0.3 + 0.7).toFixed(2);

  return { label, confidence };
}