export type Tree = {
  path: string
  mode: string
  type: 'blob' | 'tree'
  sha: string
  size: number
  url: string
}

export type Trees = {
  sha: string
  url: string
  tree: Tree[],
  truncated: boolean
}

export type Blob = {
  sha: string
  node_id: string
  size: number,
  url: string
  content: string
  encoding: string
}