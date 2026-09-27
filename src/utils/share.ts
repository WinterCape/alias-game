import { Share, Platform } from 'react-native';

export const shareGameResults = async (
  winnerName: string,
  winnerScore: number,
  teams: { name: string; score: number }[],
  shareTextTemplate: string
) => {
  const sorted = [...teams].sort((a, b) => b.score - a.score);

  const text = shareTextTemplate
    .replace('{winner}', winnerName)
    .replace('{score}', String(winnerScore));

  const standings = sorted
    .map((t, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      return `${medal} ${t.name}: ${t.score}`;
    })
    .join('\n');

  const fullText = `${text}\n\n${standings}`;

  try {
    await Share.share({
      message: fullText,
      ...(Platform.OS === 'ios' ? { url: '' } : {}),
    });
    return true;
  } catch {
    return false;
  }
};
