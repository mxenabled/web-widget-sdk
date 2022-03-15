export enum Environment {
  SAND = "sand",
  QA = "qa",
  INT = "integration",
  PROD = "production",
}

const environmentToEnvironment: Record<string, Environment> = {
  [Environment.SAND]: Environment.SAND,
  [Environment.QA]: Environment.QA,
  [Environment.INT]: Environment.INT,
  [Environment.PROD]: Environment.PROD,
}

export function lookupEnvironment(str: string): Environment {
  const env = environmentToEnvironment[str]
  if (!env) {
    throw new Error(`Invalid MX environment: ${str}`)
  }

  return env
}

const environmentToHost: Record<Environment, string> = {
  [Environment.SAND]: "https://api.sand.internal.mx",
  [Environment.QA]: "https://api.qa.internal.mx",
  [Environment.INT]: "https://int-api.mx.com",
  [Environment.PROD]: "https://api.mx.com",
}

export function lookupHost(str: string): string {
  const env = lookupEnvironment(str)
  const host = environmentToHost[env]
  if (!host) {
    throw new Error(`Missing host for MX environment: ${str}`)
  }

  return host
}
