export interface ChurchNode {
  name: string;
  title?: string;
  members?: number;
  children?: ChurchNode[];
}

export interface D3Node extends d3.HierarchyPointNode<ChurchNode> {
  x0?: number;
  y0?: number;
  _children?: D3Node[];
  nodeId?: string;
}