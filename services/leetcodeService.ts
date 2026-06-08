
export interface LeetCodeStats {
  totalSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  difficultyStats: {
    difficulty: string;
    count: number;
  }[];
}

const LEETCODE_GRAPHQL_URL = '/leetcode-api'; // Proxied in dev, needs backend in prod

const GET_USER_STATS = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

export const fetchLeetCodeStats = async (username: string): Promise<LeetCodeStats | null> => {
  try {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GET_USER_STATS,
        variables: { username },
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('LeetCode GraphQL Errors:', result.errors);
      return null;
    }

    const data = result.data;
    const matchedUser = data.matchedUser;

    if (!matchedUser) return null;

    // Parse submission calendar (it's a JSON string of timestamp:count)
    const calendar = JSON.parse(matchedUser.submissionCalendar);
    
    const stats: LeetCodeStats = {
      totalSolved: matchedUser.submitStats.acSubmissionNum.find((s: any) => s.difficulty === 'All')?.count || 0,
      acceptanceRate: 0, // Not directly in this query, can be calculated or fetched separately
      ranking: matchedUser.profile.ranking,
      contributionPoints: matchedUser.contributions.points,
      reputation: matchedUser.profile.reputation,
      submissionCalendar: calendar,
      difficultyStats: matchedUser.submitStats.acSubmissionNum,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    return null;
  }
};
