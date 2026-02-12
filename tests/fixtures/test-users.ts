/**
 * Test user credentials for saucedemo.com
 */

export interface TestUser {
  username: string;
  password: string;
  description: string;
}

export const TEST_USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with full access',
  } as TestUser,
  
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Locked out user - cannot login',
  } as TestUser,
  
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'Problem user - has issues with product images and sorting',
  } as TestUser,
  
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'Performance glitch user - experiences delays',
  } as TestUser,
  
  ERROR: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'Error user - encounters errors during checkout',
  } as TestUser,
  
  VISUAL: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'Visual user - for visual testing',
  } as TestUser,
};

export const INVALID_USERS = {
  INVALID_USERNAME: {
    username: 'invalid_user',
    password: 'secret_sauce',
  },
  INVALID_PASSWORD: {
    username: 'standard_user',
    password: 'wrong_password',
  },
  EMPTY_USERNAME: {
    username: '',
    password: 'secret_sauce',
  },
  EMPTY_PASSWORD: {
    username: 'standard_user',
    password: '',
  },
};
