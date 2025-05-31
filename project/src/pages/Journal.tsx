import React, { useState } from 'react';
import { useUserData, JournalEntry } from '../context/UserDataContext';
import { useForm } from 'react-hook-form';
import { 
  PenSquare, 
  Trash2, 
  Search, 
  X, 
  BookOpen,
  Tag,
  Calendar,
  ChevronUp,
  ChevronDown,
  Plus,
  Smile
} from 'lucide-react';

interface JournalFormData {
  title: string;
  content: string;
  mood: number;
  tags: string[];
}

const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry, addMoodLog } = useUserData();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [moodFilter, setMoodFilter] = useState<number | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<JournalFormData>({
    defaultValues: {
      title: '',
      content: '',
      mood: 5,
      tags: []
    }
  });
  
  const availableTags = [
    'anxiety', 'depression', 'stress', 'sleep', 'exercise', 
    'food', 'work', 'relationships', 'family', 'health', 
    'goals', 'gratitude', 'meditation', 'therapy', 'medication'
  ];
  
  const [selectedTag, setSelectedTag] = useState('');
  const selectedTagsWatch = watch('tags', []);
  const moodWatch = watch('mood', 5);
  
  const onSubmit = (data: JournalFormData) => {
    addJournalEntry(data);
    addMoodLog({ value: data.mood, note: data.title });
    reset();
    setIsCreating(false);
  };
  
  const addTag = (tag: string) => {
    if (tag && !selectedTagsWatch.includes(tag)) {
      setValue('tags', [...selectedTagsWatch, tag]);
    }
    setSelectedTag('');
  };
  
  const removeTag = (tagToRemove: string) => {
    setValue('tags', selectedTagsWatch.filter(tag => tag !== tagToRemove));
  };
  
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setMoodFilter(null);
  };
  
  const filteredEntries = journalEntries.filter(entry => {
    // Search term filter
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tags filter
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => entry.tags.includes(tag));
    
    // Mood filter
    const matchesMood = 
      moodFilter === null || 
      entry.mood === moodFilter;
    
    return matchesSearch && matchesTags && matchesMood;
  });
  
  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  // Get all unique tags from journal entries
  const uniqueTags = Array.from(
    new Set(journalEntries.flatMap(entry => entry.tags))
  ).sort();
  
  return (
    <div className="slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Journal & Mood Tracking</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <PenSquare className="h-4 w-4 mr-2" />
              New Entry
            </>
          )}
        </button>
      </div>
      
      {isCreating ? (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">New Journal Entry</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                className={`input ${errors.title ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="What's on your mind today?"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Journal Entry
              </label>
              <textarea
                id="content"
                rows={6}
                className={`input ${errors.content ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Write your thoughts here..."
                {...register('content', { required: 'Content is required' })}
              ></textarea>
              {errors.content && (
                <p className="mt-1 text-sm text-error-600">{errors.content.message}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label flex items-center">
                <Smile className="h-4 w-4 mr-2" />
                How are you feeling today? ({moodWatch}/10)
              </label>
              <div className="mt-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  {...register('mood', { required: true, valueAsNumber: true })}
                />
                <div className="flex justify-between mt-1 text-xs text-neutral-500">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Neutral</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedTagsWatch.map(tag => (
                  <div key={tag} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-primary-500 hover:text-primary-700"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className="input pr-10"
                    placeholder="Add a tag..."
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(selectedTag);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
                    onClick={() => addTag(selectedTag)}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-neutral-600 mb-1">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedTagsWatch.includes(tag)
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                      onClick={() => {
                        if (selectedTagsWatch.includes(tag)) {
                          removeTag(tag);
                        } else {
                          addTag(tag);
                        }
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="btn btn-outline mr-2"
                onClick={() => {
                  reset();
                  setIsCreating(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    className="input pr-10 appearance-none"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {sortOrder === 'newest' ? (
                      <ChevronDown className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    className="input pr-10 appearance-none"
                    value={moodFilter === null ? '' : moodFilter}
                    onChange={(e) => setMoodFilter(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">All Moods</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                      <option key={value} value={value}>
                        Mood: {value}/10
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tags filter */}
            {uniqueTags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-neutral-600 mb-2">Filter by tags:</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                      onClick={() => toggleTagFilter(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Active filters */}
            {(searchTerm || selectedTags.length > 0 || moodFilter !== null) && (
              <div className="mt-4 flex items-center">
                <span className="text-sm text-neutral-600 mr-2">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs flex items-center">
                      "{searchTerm}"
                      <button
                        type="button"
                        className="ml-2 text-neutral-500 hover:text-neutral-700"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {selectedTags.map(tag => (
                    <div key={tag} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs flex items-center">
                      {tag}
                      <button
                        type="button"
                        className="ml-2 text-primary-500 hover:text-primary-700"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {moodFilter !== null && (
                    <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs flex items-center">
                      Mood: {moodFilter}/10
                      <button
                        type="button"
                        className="ml-2 text-neutral-500 hover:text-neutral-700"
                        onClick={() => setMoodFilter(null)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 text-xs"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Journal Entries */}
      {!isCreating && (
        <div className="space-y-6">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No journal entries found</h3>
              <p className="text-neutral-600 mb-6">
                {journalEntries.length === 0
                  ? "You haven't created any journal entries yet."
                  : "No entries match your current filters."}
              </p>
              {journalEntries.length === 0 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsCreating(true)}
                >
                  <PenSquare className="h-4 w-4 mr-2" />
                  Create Your First Entry
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            sortedEntries.map(entry => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const entryDate = new Date(entry.date);
  const formattedDate = entryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = entryDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className={`card transition-all duration-300 ${
      isExpanded ? 'border border-primary-200' : ''
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-neutral-900">{entry.title}</h3>
          <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
            Mood: {entry.mood}/10
          </div>
        </div>
        
        <div className="flex items-center text-sm text-neutral-500 mt-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>
        
        <div className="mt-4">
          <p className={`text-neutral-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {entry.content}
          </p>
          {entry.content.length > 180 && !isExpanded && (
            <button
              className="text-primary-600 hover:text-primary-700 text-sm mt-2"
              onClick={() => setIsExpanded(true)}
            >
              Read more
            </button>
          )}
        </div>
        
        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map(tag => (
              <span key={tag} className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {isExpanded && (
          <div className="flex justify-end mt-4">
            <button
              className="text-primary-600 hover:text-primary-700 text-sm"
              onClick={() => setIsExpanded(false)}
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;