interface Rank {
  name: string;
  icon: string;
  minPoints: number;
  maxPoints?: number;
  description: string;
}

export const ranks: Rank[] = [
  {
    name: "初学小萌新",
    icon: "🌱",
    minPoints: 0,
    maxPoints: 100,
    description: "刚刚开始学习的你，充满了无限可能！",
  },
  {
    name: "勤奋小学童",
    icon: "📚",
    minPoints: 100,
    maxPoints: 300,
    description: "坚持不懈的你，正在茁壮成长！",
  },
  {
    name: "进步小达人",
    icon: "⭐",
    minPoints: 300,
    maxPoints: 600,
    description: "持续进步的你，已经展现出非凡的潜力！",
  },
  {
    name: "优秀小标兵",
    icon: "🏆",
    minPoints: 600,
    maxPoints: 1000,
    description: "出类拔萃的你，正在成为他人的榜样！",
  },
  {
    name: "超级小天才",
    icon: "👑",
    minPoints: 1000,
    description: "登峰造极的你，已经成为最耀眼的星星！",
  },
];

export function getCurrentRank(points: number): Rank {
  return ranks.reduce((prev, curr) => {
    if (
      points >= curr.minPoints &&
      (!curr.maxPoints || points < curr.maxPoints)
    ) {
      return curr;
    }
    return prev;
  }, ranks[0]);
}

// 计算下一个段位还需要多少分
export const getPointsToNextRank = (points: number): number => {
  const currentRank = getCurrentRank(points);
  const nextRank = ranks[ranks.indexOf(currentRank) + 1];

  if (!nextRank) return 0;
  return nextRank.minPoints - points;
};

// 计算当前段位进度(百分比)
export const getRankProgress = (points: number): number => {
  const currentRank = getCurrentRank(points);
  const totalRankPoints = currentRank.maxPoints - currentRank.minPoints;
  const currentRankPoints = points - currentRank.minPoints;

  return Math.min(Math.round((currentRankPoints / totalRankPoints) * 100), 100);
};
