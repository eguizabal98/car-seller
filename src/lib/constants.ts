export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  USER: 'user',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Constants for images used across the application
export const IMAGES = {
  // Use a reliable placeholder service or Supabase Storage URL
  PLACEHOLDER_CAR: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20placeholder%20studio%20lighting&image_size=landscape_4_3',
  PLACEHOLDER_SHOWROOM: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20showroom%20side%20view%204k&image_size=landscape_4_3',
};
