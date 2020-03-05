export type Tree = {
  path: string
  mode: string
  type: string
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