interface CredentialsConfig {
  name?: string;
  credentials?: Record<string, unknown>;
  authorize?: (credentials: Record<string, string> | undefined) => Promise<unknown>;
}

export default function CredentialsProvider(config: CredentialsConfig) {
  return config;
}
