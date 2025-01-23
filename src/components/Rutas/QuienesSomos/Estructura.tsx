/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChurchNode, D3Node } from '@/types/ChurchData';
import { getNodeColor, getLinkColor } from '@/utils/colors';
import { Layout } from '@/components/Loyout/Loyout';

interface TreeChartProps {
  data: ChurchNode;
}

export const TreeChart = ({ data }: TreeChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Calculate total members for each node
    const calculateTotalMembers = (node: ChurchNode): number => {
      if (node.members) return node.members;
      if (!node.children) return 0;
      return node.children.reduce((sum, child) => sum + calculateTotalMembers(child), 0);
    };

    const processedData = { ...data };
    const totalMembers = calculateTotalMembers(processedData);
    console.log('Total members:', totalMembers);


    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 20, right: 120, bottom: 30, left: 120 };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Create SVG with gradient definitions
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);

    // Add zoom behavior
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Center the initial view
    const initialTransform = d3.zoomIdentity
      .translate(margin.left, margin.top);
    svg.call(zoom.transform, initialTransform);

    // Create hierarchy
    const root = d3.hierarchy(processedData) as D3Node;

    // Assign initial positions
    root.x0 = height / 2;
    root.y0 = 0;

    // Create tree layout
    const treeLayout = d3.tree<ChurchNode>().size([height, width]);

    // Toggle children function
    function toggleChildren(d: D3Node) {
      if (d.children) {
        d._children = d.children;
        d.children = undefined;
      } else {
        d.children = d._children;
        d._children = undefined;
      }
    }

    // Update function
    function update(source: D3Node) {
      // Compute the new tree layout
      const treeData = treeLayout(root);
      const nodes = treeData.descendants();
      const links = treeData.links();

      // Normalize for fixed-depth
      nodes.forEach(d => {
        d.y = d.depth * 220;
      });

      // Update nodes
      const node = g.selectAll('g.node')
        .data(nodes, (d: any) => d.id || (d.id = ++i));

      // Enter new nodes
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${source.y0},${source.x0})`)
        .on('click', (event, d: D3Node) => {
          event.stopPropagation();
          toggleChildren(d);
          update(d);
        });

      // Add node circles with gradients
      nodeEnter.append('circle')
        .attr('r', 0)
        .style('fill', d => getNodeColor(d.depth))
        .style('stroke', d => d3.color(getNodeColor(d.depth))?.darker().toString())
        .style('stroke-width', '2px')
        .style('filter', 'url(#glow)');

      // Add labels
      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', d => d.children || d._children ? -13 : 13)
        .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
        .text(d => {
          const members = calculateTotalMembers(d.data);
          return `${d.data.name} (${members} miembros)`;
        })
        .style('fill', d => d3.color(getNodeColor(d.depth))?.darker(2).toString())
        .style('font-size', d => Math.max(16 - d.depth * 2, 11) + 'px')
        .style('font-weight', d => d.depth < 2 ? 'bold' : 'normal')
        .style('opacity', 0);

      // Add titles
      nodeEnter.append('text')
        .attr('dy', '1.75em')
        .attr('x', d => d.children || d._children ? -13 : 13)
        .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
        .text(d => d.data.title || '')
        .style('font-size', d => Math.max(12 - d.depth * 1.5, 9) + 'px')
        .style('fill', '#666')
        .style('opacity', 0);

      // Update position of nodes with animation
      const nodeUpdate = nodeEnter.merge(node as any)
        .transition()
        .duration(750)
        .attr('transform', d => `translate(${d.y},${d.x})`);

      nodeUpdate.select('circle')
        .attr('r', d => Math.max(12 - d.depth, 8))
        .style('fill', d => getNodeColor(d.depth))
        .style('stroke', d => d3.color(getNodeColor(d.depth))?.darker().toString());

      nodeUpdate.selectAll('text')
        .style('opacity', 1);

      // Remove old nodes
      const nodeExit = node.exit().transition()
        .duration(750)
        .attr('transform', d => `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select('circle')
        .attr('r', 0);

      nodeExit.selectAll('text')
        .style('opacity', 0);

      // Update links
      const link = g.selectAll('path.link')
        .data(links, (d: any) => d.target.id);

      // Enter new links
      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', d => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        })
        .style('stroke', d => getLinkColor(d.source.depth))
        .style('stroke-width', d => Math.max(3 - d.source.depth * 0.5, 1) + 'px')
        .style('opacity', 0.7);

      // Update position of links
      linkEnter.merge(link as any)
        .transition()
        .duration(750)
        .attr('d', diagonal);

      // Remove old links
      link.exit().transition()
        .duration(750)
        .attr('d', d => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Store old positions for transition
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(d: any) {
      return `M ${d.source.y} ${d.source.x}
              C ${(d.source.y + d.target.y) / 2} ${d.source.x},
                ${(d.source.y + d.target.y) / 2} ${d.target.x},
                ${d.target.y} ${d.target.x}`;
    }

    let i = 0;

    // Collapse all nodes at depth 1 initially
    root.children?.forEach(child => {
      if (child.children) {
        toggleChildren(child as D3Node);
      }
    });

    // Initialize display
    update(root);
  }, [data]);

  return (
    <Layout>
      <div style={{ width: '100%', height: '100vh' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </Layout>
  );
};