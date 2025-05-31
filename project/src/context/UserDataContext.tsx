import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface AssessmentResult {
  id: string;
  date: string;
  anxiety: number;
  depression: number;
  stress: number;
  sleep: number;
  social: number;
  overall: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
}

export interface MoodLog {
  id: string;
  date: string;
  value: number;
  note: string;
}

interface UserDataContextType {
  assessments: AssessmentResult[];
  journalEntries: JournalEntry[];
  moodLogs: MoodLog[];
  addAssessment: (assessment: Omit<AssessmentResult, 'id' | 'date'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  addMoodLog: (log: Omit<MoodLog, 'id' | 'date'>) => void;
  getLatestAssessment: () => AssessmentResult | null;
  getMoodTrend: (days: number) => MoodLog[];
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Generate mock data
const generateMockAssessments = (): AssessmentResult[] => {
  const today = new Date();
  const results: AssessmentResult[] = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i * 7); // One assessment per week
    
    results.push({
      id: uuidv4(),
      date: date.toISOString(),
      anxiety: Math.floor(Math.random() * 10) + 1,
      depression: Math.floor(Math.random() * 10) + 1,
      stress: Math.floor(Math.random() * 10) + 1,
      sleep: Math.floor(Math.random() * 10) + 1,
      social: Math.floor(Math.random() * 10) + 1,
      overall: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return results;
};

const generateMockJournalEntries = (): JournalEntry[] => {
  const today = new Date();
  const entries: JournalEntry[] = [];
  const topics = ['Morning Reflection', 'Stress Management', 'Gratitude', 'Achievement', 'Challenge'];
  const tags = ['work', 'family', 'health', 'relationship', 'personal-growth', 'anxiety', 'gratitude'];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const title = `${topics[i % topics.length]} - Day ${i + 1}`;
    const mood = Math.floor(Math.random() * 10) + 1;
    
    // Select 1-3 random tags
    const entryTags: string[] = [];
    const numTags = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numTags; j++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!entryTags.includes(tag)) {
        entryTags.push(tag);
      }
    }
    
    entries.push({
      id: uuidv4(),
      date: date.toISOString(),
      title,
      content: `This is a sample journal entry for ${date.toDateString()}. Today my mood was ${mood}/10.`,
      mood,
      tags: entryTags
    });
  }
  
  return entries;
};

const generateMockMoodLogs = (): MoodLog[] => {
  const today = new Date();
  const logs: MoodLog[] = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    logs.push({
      id: uuidv4(),
      date: date.toISOString(),
      value: Math.floor(Math.random() * 10) + 1,
      note: i % 5 === 0 ? 'Feeling good today' : ''
    });
  }
  
  return logs;
};

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  
  // Load or initialize user data
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, this would fetch data from an API
      try {
        const storedAssessments = localStorage.getItem(`assessments-${user.id}`);
        const storedJournalEntries = localStorage.getItem(`journal-${user.id}`);
        const storedMoodLogs = localStorage.getItem(`mood-${user.id}`);
        
        if (storedAssessments) {
          setAssessments(JSON.parse(storedAssessments));
        } else {
          const mockData = generateMockAssessments();
          setAssessments(mockData);
          localStorage.setItem(`assessments-${user.id}`, JSON.stringify(mockData));
        }
        
        if (storedJournalEntries) {
          setJournalEntries(JSON.parse(storedJournalEntries));
        } else {
          const mockData = generateMockJournalEntries();
          setJournalEntries(mockData);
          localStorage.setItem(`journal-${user.id}`, JSON.stringify(mockData));
        }
        
        if (storedMoodLogs) {
          setMoodLogs(JSON.parse(storedMoodLogs));
        } else {
          const mockData = generateMockMoodLogs();
          setMoodLogs(mockData);
          localStorage.setItem(`mood-${user.id}`, JSON.stringify(mockData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    } else {
      // Reset data when logged out
      setAssessments([]);
      setJournalEntries([]);
      setMoodLogs([]);
    }
  }, [isAuthenticated, user]);
  
  // Save data to storage when it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`assessments-${user.id}`, JSON.stringify(assessments));
    }
  }, [isAuthenticated, user, assessments]);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`journal-${user.id}`, JSON.stringify(journalEntries));
    }
  }, [isAuthenticated, user, journalEntries]);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`mood-${user.id}`, JSON.stringify(moodLogs));
    }
  }, [isAuthenticated, user, moodLogs]);
  
  const addAssessment = (assessment: Omit<AssessmentResult, 'id' | 'date'>) => {
    const newAssessment: AssessmentResult = {
      ...assessment,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    
    setAssessments(prev => [newAssessment, ...prev]);
  };
  
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    
    setJournalEntries(prev => [newEntry, ...prev]);
  };
  
  const addMoodLog = (log: Omit<MoodLog, 'id' | 'date'>) => {
    const newLog: MoodLog = {
      ...log,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    
    setMoodLogs(prev => [newLog, ...prev]);
  };
  
  const getLatestAssessment = (): AssessmentResult | null => {
    if (assessments.length === 0) return null;
    return assessments[0]; // Assuming assessments are sorted by date desc
  };
  
  const getMoodTrend = (days: number): MoodLog[] => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    
    return moodLogs
      .filter(log => new Date(log.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  return (
    <UserDataContext.Provider
      value={{
        assessments,
        journalEntries,
        moodLogs,
        addAssessment,
        addJournalEntry,
        addMoodLog,
        getLatestAssessment,
        getMoodTrend
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};