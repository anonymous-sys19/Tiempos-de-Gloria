export interface ChurchNode {
  name: string;
  title?: string;
  members?: number;
  children?: ChurchNode[];
}

export interface D3Node extends d3.HierarchyNode<ChurchNode> {
  x0?: number;
  y0?: number;
  x?: number;
  y?: number;
  _children?: D3Node[];
}