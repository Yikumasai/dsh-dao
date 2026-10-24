export declare const DAO_VERSION_BASE: string
export declare const DAO_VERSION: string
export declare const API_PREFIX: string
export declare const name: 'dsh-dao'
export declare const inject: string[]

export interface DaoEngineConfig {
  stateDir?: string
  dataDir?: string
  defaultMode?: 'invert' | 'passthrough'
  defaultCanon?: 'laozi+yinfu' | 'laozi' | 'yinfu' | 'custom'
  stripAgentInstructions?: boolean
}

export declare function createDaoEngine(opts?: DaoEngineConfig): {
  getMode(): 'invert' | 'passthrough'
  setMode(nextMode: string): 'invert' | 'passthrough'
  toggleMode(): 'invert' | 'passthrough'
  getCanon(): 'laozi+yinfu' | 'laozi' | 'yinfu' | 'custom'
  setCanon(nextCanon: string): { ok: boolean; canon: string; canon_name: string; chars: number }
  getCustomSPInfo(): Record<string, unknown>
  setCustomSP(spText: string, keepBlocks?: boolean, source?: string): Record<string, unknown>
  resetCustomSP(): Record<string, unknown>
  getStripInstructions(): boolean
  setStripInstructions(val: boolean): boolean
  getCoreDaoPrompt(): string
  getDefaultDaoPrompt(canon?: string): string
  invertSP(spText: string): string | null
  transformAssembly(assembly: Record<string, unknown>, context?: Record<string, unknown>): {
    assembly: Record<string, unknown>
    before: string
    after: string
    transformed: boolean
    keptSections: string[]
    removedSections: string[]
  }
  recordCapture(ev: Record<string, unknown>): Record<string, unknown>
  getPing(): Record<string, unknown>
  getSig(): Record<string, unknown>
  getPreview(): Record<string, unknown>
  getTape(limit?: number, includeFields?: boolean): Record<string, unknown>
  getAllInjects(): Record<string, unknown>
  getLastInject(): Record<string, unknown> | null
  pushWvDbg(entry: Record<string, unknown>): { ok: boolean; count: number }
  getWvDbg(): { ok: boolean; count: number; log: unknown[] }
  attachSseClient(req: unknown, res: unknown): void
  closeAllSse(): void
}

export declare function apply(ctx: unknown, config?: DaoEngineConfig): void
declare const _default: {
  name: 'dsh-dao'
  inject: string[]
  apply: typeof apply
}
export default _default
