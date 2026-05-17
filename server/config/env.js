import dotenv from 'dotenv';

dotenv.config();

function cleanEnvValue(value) {
  if (value == null) return '';
  return String(value).trim().replace(/^["']|["']$/g, '');
}

function isPlaceholderKey(value) {
  if (!value) return true;

  const lower = value.toLowerCase();

  return (
    lower.startsWith('your_') ||
    lower.includes('your_adzuna') ||
    lower.includes('your_google') ||
    lower === 'paste_your_key_here'
  );
}

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || 'development',

  clientUrl:
    cleanEnvValue(process.env.CLIENT_URL) ||
    'http://localhost:5173',

  mongoUri: cleanEnvValue(process.env.MONGO_URI),

  jwtSecret: cleanEnvValue(process.env.JWT_SECRET),

  jwtExpire: process.env.JWT_EXPIRE || '30d',

  adzunaAppId: (() => {
    const key = cleanEnvValue(process.env.ADZUNA_APP_ID);

    if (isPlaceholderKey(key)) return '';

    return key;
  })(),

  adzunaAppKey: (() => {
    const key = cleanEnvValue(process.env.ADZUNA_APP_KEY);

    if (isPlaceholderKey(key)) return '';

    return key;
  })(),

  geminiApiKey: (() => {
    const key = cleanEnvValue(process.env.GEMINI_API_KEY);

    if (isPlaceholderKey(key)) return '';

    return key;
  })(),
};

export const validateEnv = () => {
  const missing = [];

  if (!env.mongoUri) missing.push('MONGO_URI');

  if (!env.jwtSecret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    console.error(
      `[env] Missing required environment variables: ${missing.join(', ')}`
    );

    process.exit(1);
  }

  if (env.adzunaAppId && env.adzunaAppKey) {
    console.log(
      `[env] ADZUNA API KEY loaded (***${env.adzunaAppKey.slice(-4)})`
    );
  } else {
    console.warn(
      '[env] ADZUNA credentials not set — fallback mode enabled'
    );
  }

  if (env.geminiApiKey) {
    console.log(
      `[env] GEMINI_API_KEY loaded (***${env.geminiApiKey.slice(-4)})`
    );
  } else {
    console.warn(
      '[env] GEMINI_API_KEY not set — interview prep fallback enabled'
    );
  }

  console.log(
    `[env] PORT=${env.port} NODE_ENV=${env.nodeEnv}`
  );
};

export const corsOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);
