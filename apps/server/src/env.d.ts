declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number;
            MONGODB_URI_DEV: string;
            JWT_EXPIRES_IN?: StringValue;
            SALT_ROUNDS: number;
            NODE_ENV: string;
            JWT_SECRET: string;
            NATS_URLS: string;
        }
    }
}


export { };
