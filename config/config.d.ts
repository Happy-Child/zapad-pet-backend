declare module 'config' {
  export const NODE_ENV: string;

  export const DB: {
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
  };

  export const MAIL_SENDER: {
    HOST: string;
    PORT: number;
    USER: string;
    PASSWORD: string;
  };

  export const FRONT_URL: string;
}
