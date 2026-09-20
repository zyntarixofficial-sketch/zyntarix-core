export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",

    appUrl: process.env.APP_URL ?? "",

    databaseUrl: process.env.DATABASE_URL ?? "",

    redisUrl: process.env.REDIS_URL ?? "",

    geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  };
}
