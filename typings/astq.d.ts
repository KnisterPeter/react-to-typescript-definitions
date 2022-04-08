declare module 'astq' {
  namespace ASTQ {}
  class ASTQ {
    public adapter(
      adapter:
        | 'mozast'
        | 'graphql'
        | 'xmldom'
        | 'parse5'
        | 'json'
        | 'cheero'
        | 'unist'
        | 'asty',
      force: boolean
    ): void;
    public query(
      ast: any,
      query: string,
      options?: any,
      trace?: boolean
    ): any[];
  }

  export = ASTQ;
}
