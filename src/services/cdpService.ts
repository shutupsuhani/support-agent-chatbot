import { CDPPlatform } from '../types';
import { segmentDocs, mParticleDocs, lyticsDocs, zeotapDocs } from '../data/cdpData';

// Function to determine if a question is CDP-related
const isCDPRelatedQuestion = (question: string): boolean => {
  const cdpKeywords = [
    'segment', 'mparticle', 'lytics', 'zeotap', 'cdp', 'customer data platform',
    'source', 'destination', 'integration', 'audience', 'profile', 'tracking',
    'event', 'identity', 'user', 'data', 'analytics', 'tag', 'pixel'
  ];
  
  const lowerQuestion = question.toLowerCase();
  return cdpKeywords.some(keyword => lowerQuestion.includes(keyword));
};

// Function to determine if it's a comparison question
const isComparisonQuestion = (question: string, platforms: CDPPlatform[]): boolean => {
  if (platforms.length < 2) return false;
  
  const lowerQuestion = question.toLowerCase();
  const comparisonKeywords = ['compare', 'comparison', 'versus', 'vs', 'difference', 'better', 'best'];
  
  // Check if the question contains comparison keywords
  const hasComparisonKeyword = comparisonKeywords.some(keyword => lowerQuestion.includes(keyword));
  
  // Check if the question mentions multiple platforms
  const mentionedPlatforms = platforms.filter(platform => 
    lowerQuestion.includes(platform.toLowerCase())
  );
  
  return hasComparisonKeyword && mentionedPlatforms.length >= 2;
};

// Function to extract relevant information from documentation
const extractRelevantInfo = (question: string, platform: CDPPlatform): string => {
  const lowerQuestion = question.toLowerCase();
  let docs;
  
  switch (platform) {
    case 'Segment':
      docs = segmentDocs;
      break;
    case 'mParticle':
      docs = mParticleDocs;
      break;
    case 'Lytics':
      docs = lyticsDocs;
      break;
    case 'Zeotap':
      docs = zeotapDocs;
      break;
  }
  
  // Extract keywords from the question
  const keywords = lowerQuestion.split(' ')
    .filter(word => word.length > 3)
    .map(word => word.replace(/[^\w]/g, ''));
  
  // Find the most relevant documentation section
  let bestMatch = '';
  let highestScore = 0;
  
  for (const [section, content] of Object.entries(docs)) {
    const lowerSection = section.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    // Calculate relevance score based on keyword matches
    let score = 0;
    keywords.forEach(keyword => {
      if (lowerSection.includes(keyword)) score += 3;
      if (lowerContent.includes(keyword)) score += 1;
    });
    
    // Boost score for how-to questions
    if (lowerQuestion.includes('how') && lowerSection.includes('how')) {
      score += 2;
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = content;
    }
  }
  
  return bestMatch || `I don't have specific information about that in ${platform}. Please check the official ${platform} documentation for more details.`;
};

// Function to compare platforms
const comparePlatforms = (question: string, platforms: CDPPlatform[]): string => {
  // Extract the feature being compared
  const features = [
    { keywords: ['source', 'sources', 'data source'], feature: 'data sources' },
    { keywords: ['destination', 'destinations', 'integration'], feature: 'integrations' },
    { keywords: ['audience', 'segment', 'segmentation'], feature: 'audience creation' },
    { keywords: ['profile', 'user profile', 'identity'], feature: 'user profiles' },
    { keywords: ['track', 'tracking', 'event'], feature: 'event tracking' }
  ];
  
  const lowerQuestion = question.toLowerCase();
  let featureBeingCompared = 'features';
  
  for (const { keywords, feature } of features) {
    if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
      featureBeingCompared = feature;
      break;
    }
  }
  
  // Generate comparison response
  const mentionedPlatforms = platforms.filter(platform => 
    lowerQuestion.includes(platform.toLowerCase())
  );
  
  const platformsToCompare = mentionedPlatforms.length >= 2 
    ? mentionedPlatforms 
    : platforms.slice(0, 2);
  
  const comparisonResponses: Record<string, Record<string, string>> = {
    'data sources': {
      'Segment-mParticle': 'Segment offers a wider range of source integrations with a simpler setup process, while mParticle provides more granular data control and validation at the collection point.',
      'Segment-Lytics': 'Segment focuses on ease of implementation across many platforms, while Lytics offers deeper behavioral data collection capabilities.',
      'Segment-Zeotap': 'Segment has more pre-built source integrations, while Zeotap specializes in mobile and telco data sources with stronger identity resolution.',
      'mParticle-Lytics': 'mParticle offers more robust data validation and transformation during collection, while Lytics focuses on behavioral data collection for personalization.',
      'mParticle-Zeotap': 'mParticle provides more comprehensive SDK support for mobile applications, while Zeotap has stronger telecom data integration capabilities.',
      'Lytics-Zeotap': 'Lytics focuses on behavioral data collection with content affinity, while Zeotap specializes in deterministic identity data collection.'
    },
    'integrations': {
      'Segment-mParticle': 'Segment has a larger marketplace of destinations, while mParticle offers more sophisticated audience forwarding capabilities.',
      'Segment-Lytics': 'Segment connects to more marketing tools, while Lytics has deeper integrations with content management systems.',
      'Segment-Zeotap': 'Segment offers more marketing and analytics destinations, while Zeotap has stronger advertising platform integrations.',
      'mParticle-Lytics': 'mParticle provides more real-time activation options, while Lytics offers better content personalization integrations.',
      'mParticle-Zeotap': 'mParticle has broader marketing technology integrations, while Zeotap specializes in advertising platform connections.',
      'Lytics-Zeotap': 'Lytics excels at content management integrations, while Zeotap has stronger connections to advertising platforms and DMPs.'
    },
    'audience creation': {
      'Segment-mParticle': 'Segment Personas offers rule-based audience building with SQL access, while mParticle provides more real-time audience capabilities with lookalike modeling.',
      'Segment-Lytics': 'Segment uses a SQL-based approach to audience creation, while Lytics offers machine learning-powered behavioral scoring and affinity models.',
      'Segment-Zeotap': 'Segment focuses on first-party data segmentation, while Zeotap offers enrichment with third-party data for more robust audience building.',
      'mParticle-Lytics': 'mParticle provides strong rule-based audience tools with journey analytics, while Lytics uses machine learning for predictive audience creation.',
      'mParticle-Zeotap': 'mParticle excels at real-time audience creation based on app behavior, while Zeotap offers stronger third-party data enrichment.',
      'Lytics-Zeotap': 'Lytics uses behavioral scoring and content affinity for audiences, while Zeotap leverages deterministic identity matching and third-party data.'
    },
    'user profiles': {
      'Segment-mParticle': 'Segment offers a unified profile with identity resolution, while mParticle provides more granular user attribute control and privacy management.',
      'Segment-Lytics': 'Segment focuses on collecting and unifying user data, while Lytics adds behavioral scoring and content affinity to user profiles.',
      'Segment-Zeotap': 'Segment builds profiles primarily from first-party data, while Zeotap specializes in enriching profiles with additional identity signals.',
      'mParticle-Lytics': 'mParticle offers stronger profile governance and consent management, while Lytics adds predictive behavioral attributes to profiles.',
      'mParticle-Zeotap': 'mParticle provides comprehensive cross-device identity management, while Zeotap offers stronger deterministic identity resolution.',
      'Lytics-Zeotap': 'Lytics focuses on behavioral attributes in profiles, while Zeotap specializes in identity resolution across channels.'
    },
    'event tracking': {
      'Segment-mParticle': 'Segment offers simpler implementation with JavaScript and server-side libraries, while mParticle provides more sophisticated data planning and validation.',
      'Segment-Lytics': 'Segment has broader language support for event tracking, while Lytics focuses more on content interaction events.',
      'Segment-Zeotap': 'Segment provides more comprehensive web event tracking, while Zeotap has stronger mobile app event capabilities.',
      'mParticle-Lytics': 'mParticle offers more robust mobile and OTT event tracking, while Lytics specializes in content engagement events.',
      'mParticle-Zeotap': 'mParticle provides more comprehensive SDK support across platforms, while Zeotap has specialized telco event tracking.',
      'Lytics-Zeotap': 'Lytics focuses on behavioral and content interaction events, while Zeotap specializes in identity-related events and mobile tracking.'
    },
    'features': {
      'Segment-mParticle': 'Segment offers a simpler interface with focus on data collection and routing, while mParticle provides more advanced data governance, consent management, and audience tools.',
      'Segment-Lytics': 'Segment excels at data collection and distribution, while Lytics focuses on behavioral analysis, content affinity, and predictive modeling.',
      'Segment-Zeotap': 'Segment provides comprehensive data collection and integration tools, while Zeotap specializes in identity resolution and third-party data enrichment.',
      'mParticle-Lytics': 'mParticle offers stronger data governance and real-time capabilities, while Lytics provides better content intelligence and behavioral predictions.',
      'mParticle-Zeotap': 'mParticle has more comprehensive platform support and consent management, while Zeotap offers stronger identity resolution and data enrichment.',
      'Lytics-Zeotap': 'Lytics focuses on behavioral intelligence and content affinity, while Zeotap specializes in identity resolution and advertising use cases.'
    }
  };
  
  // Sort platforms alphabetically to match the comparison key format
  const sortedPlatforms = [...platformsToCompare].sort();
  const comparisonKey = `${sortedPlatforms[0]}-${sortedPlatforms[1]}`;
  
  const comparisonText = comparisonResponses[featureBeingCompared]?.[comparisonKey] || 
    `When comparing ${platformsToCompare.join(' and ')} for ${featureBeingCompared}, both platforms offer different approaches. Please check their official documentation for detailed comparisons.`;
  
  return `Comparing ${platformsToCompare.join(' and ')} for ${featureBeingCompared}:\n\n${comparisonText}`;
};

// Main function to fetch CDP answer
export const fetchCDPAnswer = async (
  question: string, 
  selectedPlatforms: CDPPlatform[]
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if the question is CDP-related
  if (!isCDPRelatedQuestion(question)) {
    return "I'm a CDP support agent and can only answer questions related to Customer Data Platforms like Segment, mParticle, Lytics, and Zeotap. Please ask me how to perform specific tasks in these platforms.";
  }
  
  // Check if it's a comparison question
  if (isComparisonQuestion(question, selectedPlatforms)) {
    return comparePlatforms(question, selectedPlatforms);
  }
  
  // If only one platform is selected, provide information for that platform
  if (selectedPlatforms.length === 1) {
    return extractRelevantInfo(question, selectedPlatforms[0]);
  }
  
  // If multiple platforms are selected, provide information for each
  const responses = selectedPlatforms.map(platform => {
    const info = extractRelevantInfo(question, platform);
    return `**${platform}**:\n${info}`;
  });
  
  return responses.join('\n\n');
};