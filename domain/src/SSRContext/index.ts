export interface SSRContext {
  url: string;
  selectedPost?: any;
  user?: any
  state?: any
  rendered?: Function
}