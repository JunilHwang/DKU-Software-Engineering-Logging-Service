export interface GithubTree {
  path: string
  mode: string
  type: 'blob' | 'tree'
  sha: string
  size: number
  url: string
}

export interface GithubTrees {
  sha: string
  url: string
  tree: GithubTree[],
  truncated: boolean
}

export interface GithubBlob {
  sha: string
  node_id: string
  size: number,
  url: string
  content: string
  encoding: string
}