// Helper function to generate DiceBear avatar URLs
export function generateDiceBearAvatar(seed: string): string {
  // Use the lead's name as seed to ensure consistent avatars
  const cleanSeed = seed.toLowerCase().replace(/\s+/g, '');
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanSeed}`;
}

// Alternative function to generate avatar based on lead ID for more variation
export function generateDiceBearAvatarById(id: string): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${id}`;
}

// Function that prioritizes existing avatar, falls back to generated one
export function getLeadAvatar(lead: { id: string; name: string; avatar?: string }): string {
  if (lead.avatar && lead.avatar.includes('unsplash')) {
    return lead.avatar; // Keep existing Unsplash avatars
  }
  return generateDiceBearAvatar(lead.name);
}