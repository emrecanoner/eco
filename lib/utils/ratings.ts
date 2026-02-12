export function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  return "⭐".repeat(fullStars) + "☆".repeat(5 - fullStars);
}


