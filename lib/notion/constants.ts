// Notion database property names
export const NOTION_PROPERTIES = {
  // Common
  TITLE: "Title",
  
  // Profile
  NAME: "Name",
  BIO: "Bio",
  EMAIL: "Email",
  LOCATION: "Location",
  SKILLS: "Skills",
  GITHUB: "GitHub",
  LINKEDIN: "LinkedIn",
  TWITTER: "Twitter",
  WEBSITE: "Website",
  
  // Blog
  SLUG: "Slug",
  STATUS: "Status",
  PUBLISHED_DATE: "Published Date",
  EXCERPT: "Excerpt",
  COVER_IMAGE: "Cover Image",
  
  // Movies
  TYPE: "Type",
  DIRECTOR: "Director",
  RATING: "Rating",
  WATCHED_DATE: "Watched Date",
  POSTER: "Poster",
  YEAR: "Year",
  GENRE: "Genre",
  
  // Books
  AUTHOR: "Author",
  READ_DATE: "Read Date",
  COVER: "Cover",
  PAGES: "Pages",
  
  // Settings
  FAVICON: "Favicon",
  SITE_NAME: "Site Name",
  DESCRIPTION: "Description",
  META_TAGS: "Meta Tags",
} as const;

// Animation constants
export const ANIMATION_DELAYS = {
  CARD_STAGGER: 0.1,
  CARD_FAST: 0.05,
  NAV_ITEM: 0.1,
} as const;

// Notion API version
// Using 2022-06-28 for stability - 2025-09-03 has breaking changes
// that require data_source_id and may cause "Invalid request URL" errors
// If you need 2025-09-03 features, ensure your databases are properly configured
export const NOTION_API_VERSION = "2022-06-28";

