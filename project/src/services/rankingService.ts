export interface UserScore {
  user_id: string;
  username: string;
  score: number;
  wins: number;
  streak: number;
  accuracy: number;
  time_bonus: number;
  last_updated: string;
}

export interface ScoreUpdate {
  user_id: string;
  username: string;
  component: string; // "time_keeper", "exam_practice", "countdown_arena"
  score_gained: number;
  accuracy: number;
  time_used: number;
  questions_answered: number;
  correct_answers: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  score: number;
  wins: number;
  streak: number;
  accuracy: number;
  time_bonus: number;
  last_updated: string;
}

export interface ComponentStats {
  attempts: number;
  total_score: number;
  avg_accuracy: number;
  total_time: number;
  total_questions: number;
  total_correct: number;
  success_rate: number;
}

class RankingService {
  private baseUrl = 'http://localhost:8000';
  private currentUserId: string | null = null;
  private currentUsername: string | null = null;
  private isUpdating = false; // Flag to prevent multiple simultaneous updates

  constructor() {
    // Try to get user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserId = user.user_id;
      this.currentUsername = user.username;
    }
  }

  // Generate or get current user
  private getCurrentUser() {
    if (!this.currentUserId || !this.currentUsername) {
      // Generate new user
      this.currentUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.currentUsername = `Player_${Math.floor(Math.random() * 10000)}`;
      
      // Save to localStorage
      const user = {
        user_id: this.currentUserId,
        username: this.currentUsername
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return {
      user_id: this.currentUserId!,
      username: this.currentUsername!
    };
  }

  // Update score after completing a component
  async updateScore(component: string, scoreGained: number, accuracy: number, timeUsed: number, questionsAnswered: number, correctAnswers: number) {
    // Prevent multiple simultaneous updates
    if (this.isUpdating) {
      console.warn('[updateScore] Update already in progress, skipping...');
      return;
    }
    
    this.isUpdating = true;
    
    try {
      const user = this.getCurrentUser();
      
      // Fallbacks for missing/invalid values
      const safeNumber = (v: any) => (typeof v === 'number' && !isNaN(v) ? v : 0);
      const safeString = (v: any) => (typeof v === 'string' ? v : '');

      const scoreUpdate: ScoreUpdate = {
        user_id: user.user_id,
        username: user.username,
        component: safeString(component),
        score_gained: safeNumber(scoreGained),
        accuracy: safeNumber(accuracy),
        time_used: safeNumber(timeUsed),
        questions_answered: safeNumber(questionsAnswered),
        correct_answers: safeNumber(correctAnswers)
      };

      // Debug log
      console.log('[updateScore] Payload:', scoreUpdate);

      // Warn if any field was defaulted
      const requiredFields = [
        'component', 'score_gained', 'accuracy', 'time_used', 'questions_answered', 'correct_answers'
      ];
      for (const field of requiredFields) {
        if (
          (typeof scoreUpdate[field as keyof ScoreUpdate] === 'number' && isNaN(scoreUpdate[field as keyof ScoreUpdate])) ||
          (typeof scoreUpdate[field as keyof ScoreUpdate] === 'string' && scoreUpdate[field as keyof ScoreUpdate] === '')
        ) {
          console.warn(`[updateScore] Field defaulted: ${field}`);
        }
      }

      const response = await fetch(`${this.baseUrl}/update-score/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreUpdate),
      });

      if (!response.ok) {
        throw new Error(`Failed to update score: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    } finally {
      this.isUpdating = false;
    }
  }

  // Get global leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/leaderboard/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      return data.leaderboard || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get current user stats
  async getUserStats(): Promise<UserScore | null> {
    const user = this.getCurrentUser();
    
    try {
      const response = await fetch(`${this.baseUrl}/user-stats/${user.user_id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // User doesn't exist yet, return null
          return null;
        }
        throw new Error('Failed to fetch user stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  // Get component-specific stats
  async getComponentStats(): Promise<Record<string, ComponentStats>> {
    const user = this.getCurrentUser();
    
    try {
      const response = await fetch(`${this.baseUrl}/component-stats/${user.user_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch component stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching component stats:', error);
      return {};
    }
  }

  // Get current user info
  getCurrentUserInfo() {
    return this.getCurrentUser();
  }

  // Update username
  updateUsername(newUsername: string) {
    this.currentUsername = newUsername;
    const user = this.getCurrentUser();
    user.username = newUsername;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

export const rankingService = new RankingService(); 