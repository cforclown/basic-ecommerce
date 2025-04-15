import dotenv from 'dotenv';

dotenv.config();

export function getEnvOrThrow (environmentVariableName: string): string {
  const value = process.env[environmentVariableName];
  if (!value) {
    throw new Error(`Environment variable ${environmentVariableName} not set!`);
  }
  return value;
}

export const getEnv = (environmentVariableName: string): string | undefined => process.env[environmentVariableName];

export const Environment = {
  getNodeEnv: (): 'development' | 'test' | 'production' => {
    const value = getEnv('NODE_ENV');
    if (value !== 'development' && value !== 'test' && value !== 'production') {
      console.warn('NODE_ENV is not set to development, test or production. Defaulting to development.');
      
      return 'development';
    }

    return value;
  },

  getAppPort: (): string => getEnvOrThrow('PORT'),
  getAccessTokenSecret: (): string => getEnvOrThrow('ACCESS_TOKEN_SECRET'),
};
