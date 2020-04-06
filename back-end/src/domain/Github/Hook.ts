export interface GithubHookConfig {
  content_type: 'json',
  insecure_ssl: '0'|'1',
  url: string
}

export interface GithubHookLastResponse {
  code: null|string,
  status: string,
}

export interface GithubHookData {
  type: string,
  id: number,
  name: string,
  active: boolean,
  events: string[],
  config: GithubHookConfig,
  updated_at: string,
  created_at: string,
  url: string,
  test_url: string,
  ping_url: string,
  last_response: GithubHookLastResponse
  message: null|string
}