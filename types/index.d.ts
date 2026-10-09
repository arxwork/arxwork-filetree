export type FileNode = {
  id: string
  parent: string
  name: string
  kind: 'dir' | 'file' | 'link'
  hidden: boolean
  mtime: number
  size: number
  loaded: boolean
}

export type Branch = {
  head: string
  upstream: string
  ahead: number
  behind: number
}

export type Activity = {
  id: number
  kind: string
  label: string
  state: 'running' | 'done' | 'failed'
  detail: string
  at: number
  tone: string
  nerd: string
  plain: string
}

export type FileTree = {
  root: string
  nodes: FileNode[]
  expanded: string[]
  cursor: string
  selected: string
  query: string
  showHidden: boolean
  showSize: boolean
  dirSizes: Record<string, number>
  git: Record<string, string>
  diff: Record<string, [number, number]>
  ignored: string[]
  untrackedDirs: string[]
  top: string
  prefix: string
  branch: Branch | null
  counts: Record<string, [number, number, number]>
  flash: string[]
  flashDim: string[]
  flashOn: boolean
  flashTones: Record<string, string>
  scroll: number | null
}

// arxwork: what Claude is doing now and every file it touched this session.
// kind: the latest thing done to the file; edited: whether it was ever edited this session.
export type ClaudeTouch = {
  path: string
  kind: 'read' | 'edit' | 'commit'
  at: number
  edited?: boolean
}

// paths: every file in the current burst of same-kind activity, `path` the latest.
export type ClaudeNow = {
  path: string
  kind: 'read' | 'edit'
  at: number
  running: boolean
  paths?: string[]
}

export type ClaudeActivity = {
  now: ClaudeNow | null
  touched: ClaudeTouch[]
  committed?: { paths: string[]; at: number }
}

export type Theme = {
  fg: string
  accent: string
  muted: string
  urgent: string
  selection: string
  bg: string
}

declare module 'claude-code' {
  interface PluginState {
    filetree: {
      tree: FileTree
      theme: Theme
      activity: Activity[]
      claude: ClaudeActivity
    }
  }
}
