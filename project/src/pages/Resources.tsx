import React, { useState } from 'react';
import { Search, ExternalLink, Book, Video, Clock, X, Check, Users, Award, Heart } from 'lucide-react';

// Resource types
type ResourceType = 'article' | 'video' | 'app' | 'community' | 'professional';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  tags: string[];
  estimatedTime?: string;
  image?: string;
  featured?: boolean;
}

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  
  // Mock resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Anxiety: Causes, Symptoms, and Treatments',
      description: 'Learn about the root causes of anxiety disorders, how to recognize symptoms, and evidence-based treatment options.',
      type: 'article',
      url: 'https://example.com/anxiety-guide',
      tags: ['anxiety', 'mental-health', 'education'],
      estimatedTime: '15 min read',
      image: 'https://images.pexels.com/photos/3758104/pexels-photo-3758104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      featured: true
    },
    {
      id: '2',
      title: 'Guided Meditation for Stress Relief',
      description: 'A calming guided meditation practice designed to reduce stress and promote relaxation in just 10 minutes.',
      type: 'video',
      url: 'https://example.com/meditation-video',
      tags: ['meditation', 'stress', 'relaxation'],
      estimatedTime: '10 min video',
      image: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '3',
      title: 'CBT Companion: Cognitive Behavioral Therapy Tools',
      description: 'An app that provides evidence-based CBT exercises to help manage depression, anxiety, and other mental health conditions.',
      type: 'app',
      url: 'https://example.com/cbt-app',
      tags: ['cbt', 'therapy', 'depression', 'anxiety'],
      image: 'https://images.pexels.com/photos/4069292/pexels-photo-4069292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '4',
      title: 'Sleep Hygiene: Building Better Sleep Habits',
      description: 'Practical tips for improving your sleep quality, establishing a healthy sleep routine, and overcoming insomnia.',
      type: 'article',
      url: 'https://example.com/sleep-guide',
      tags: ['sleep', 'health', 'habits'],
      estimatedTime: '12 min read',
      image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '5',
      title: 'Finding Support: Mental Health Support Groups Near You',
      description: 'A directory of local and online support groups for various mental health conditions, with information on how to join.',
      type: 'community',
      url: 'https://example.com/support-groups',
      tags: ['support', 'community', 'connection'],
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      featured: true
    },
    {
      id: '6',
      title: 'Therapist Directory: Find Mental Health Professionals',
      description: 'Search for licensed therapists, counselors, and psychiatrists in your area, with filters for specialties and insurance.',
      type: 'professional',
      url: 'https://example.com/therapist-directory',
      tags: ['therapy', 'professional', 'treatment'],
      image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '7',
      title: 'The Science of Gratitude: How Thankfulness Improves Mental Health',
      description: 'Research-backed information on how practicing gratitude can positively impact your mental wellbeing and practical exercises to get started.',
      type: 'article',
      url: 'https://example.com/gratitude-science',
      tags: ['gratitude', 'positive-psychology', 'wellbeing'],
      estimatedTime: '8 min read',
      image: 'https://images.pexels.com/photos/6980608/pexels-photo-6980608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: '8',
      title: 'Mindfulness for Beginners: Simple Daily Practices',
      description: 'A step-by-step guide to incorporating mindfulness into your daily routine, with simple exercises for beginners.',
      type: 'video',
      url: 'https://example.com/mindfulness-video',
      tags: ['mindfulness', 'beginners', 'daily-practice'],
      estimatedTime: '18 min video',
      image: 'https://images.pexels.com/photos/775417/pexels-photo-775417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];
  
  // All unique tags from resources
  const allTags = Array.from(new Set(resources.flatMap(r => r.tags))).sort();
  
  // Filter resources based on search, tags, and types
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => resource.tags.includes(tag));
    
    const matchesTypes = 
      selectedTypes.length === 0 || 
      selectedTypes.includes(resource.type);
    
    return matchesSearch && matchesTags && matchesTypes;
  });
  
  // Featured resources
  const featuredResources = resources.filter(resource => resource.featured);
  
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const toggleTypeFilter = (type: ResourceType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedTypes([]);
  };
  
  const toggleSaved = (id: string) => {
    if (saved.includes(id)) {
      setSaved(saved.filter(s => s !== id));
    } else {
      setSaved([...saved, id]);
    }
  };
  
  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case 'article':
        return <Book className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'community':
        return <Users className="h-5 w-5" />;
      case 'professional':
        return <Award className="h-5 w-5" />;
      case 'app':
        return <Heart className="h-5 w-5" />;
      default:
        return <Book className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="slide-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Mental Health Resources</h1>
      </div>
      
      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredResources.map(resource => (
              <div key={resource.id} className="card overflow-hidden">
                {resource.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={resource.image} 
                      alt={resource.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className={`p-1.5 rounded-md mr-2 ${
                        resource.type === 'article' ? 'bg-primary-100 text-primary-700' :
                        resource.type === 'video' ? 'bg-secondary-100 text-secondary-700' :
                        resource.type === 'app' ? 'bg-accent-100 text-accent-700' :
                        resource.type === 'community' ? 'bg-warning-50 text-warning-600' :
                        'bg-success-50 text-success-600'
                      }`}>
                        {getIconForType(resource.type)}
                      </span>
                      <span className="text-sm font-medium capitalize">{resource.type}</span>
                    </div>
                    {resource.estimatedTime && (
                      <div className="flex items-center text-sm text-neutral-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{resource.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mt-3">{resource.title}</h3>
                  <p className="text-neutral-600 mt-2">{resource.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-neutral-200"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                    >
                      Access Resource
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                    <button
                      type="button"
                      className={`p-2 rounded-full ${
                        saved.includes(resource.id)
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      }`}
                      onClick={() => toggleSaved(resource.id)}
                      aria-label={saved.includes(resource.id) ? 'Remove from saved' : 'Save for later'}
                    >
                      {saved.includes(resource.id) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              className="input pl-10"
              placeholder="Search resources..."
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
        </div>
        
        {/* Type filters */}
        <div className="mt-4">
          <p className="text-sm text-neutral-600 mb-2">Filter by type:</p>
          <div className="flex flex-wrap gap-2">
            {(['article', 'video', 'app', 'community', 'professional'] as ResourceType[]).map(type => (
              <button
                key={type}
                type="button"
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  selectedTypes.includes(type)
                    ? type === 'article' ? 'bg-primary-100 text-primary-700' :
                      type === 'video' ? 'bg-secondary-100 text-secondary-700' :
                      type === 'app' ? 'bg-accent-100 text-accent-700' :
                      type === 'community' ? 'bg-warning-50 text-warning-600' :
                      'bg-success-50 text-success-600'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                onClick={() => toggleTypeFilter(type)}
              >
                <span className="mr-1.5">
                  {getIconForType(type)}
                </span>
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tags filter */}
        <div className="mt-4">
          <p className="text-sm text-neutral-600 mb-2">Filter by tags:</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
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
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Active filters */}
        {(searchTerm || selectedTags.length > 0 || selectedTypes.length > 0) && (
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
              
              {selectedTypes.map(type => (
                <div key={type} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs flex items-center">
                  <span className="capitalize">{type}</span>
                  <button
                    type="button"
                    className="ml-2 text-neutral-500 hover:text-neutral-700"
                    onClick={() => toggleTypeFilter(type)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedTags.map(tag => (
                <div key={tag} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs flex items-center">
                  #{tag}
                  <button
                    type="button"
                    className="ml-2 text-primary-500 hover:text-primary-700"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
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
      
      {/* Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="card h-full flex flex-col">
            {resource.image && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>
            )}
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className={`p-1.5 rounded-md mr-2 ${
                    resource.type === 'article' ? 'bg-primary-100 text-primary-700' :
                    resource.type === 'video' ? 'bg-secondary-100 text-secondary-700' :
                    resource.type === 'app' ? 'bg-accent-100 text-accent-700' :
                    resource.type === 'community' ? 'bg-warning-50 text-warning-600' :
                    'bg-success-50 text-success-600'
                  }`}>
                    {getIconForType(resource.type)}
                  </span>
                  <span className="text-sm font-medium capitalize">{resource.type}</span>
                </div>
                {resource.estimatedTime && (
                  <div className="flex items-center text-sm text-neutral-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{resource.estimatedTime}</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mt-3">{resource.title}</h3>
              <p className="text-neutral-600 text-sm mt-2 flex-grow">{resource.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {resource.tags.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full text-xs cursor-pointer hover:bg-neutral-200"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    #{tag}
                  </span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="text-neutral-500 text-xs">+{resource.tags.length - 3} more</span>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  Access Resource
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
                <button
                  type="button"
                  className={`p-1.5 rounded-full ${
                    saved.includes(resource.id)
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                  }`}
                  onClick={() => toggleSaved(resource.id)}
                  aria-label={saved.includes(resource.id) ? 'Remove from saved' : 'Save for later'}
                >
                  {saved.includes(resource.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No resources found</h3>
          <p className="text-neutral-600 mb-6">
            Try adjusting your filters or search term.
          </p>
          <button
            className="btn btn-outline"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Resources;