'use client';

import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  cloneElement,
  isValidElement,
} from 'react';

type DebugWrapperProps = {
  children: React.ReactNode;
  label?: string;
  level?: number;
  debug: boolean;
  className?: string;
};

export function DebugWrapper({
  children,
  label,
  level = 1,
  debug,
  className = '',
}: DebugWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [metrics, setMetrics] = useState({
    padding: '',
    margin: '',
    gap: '',
    childPadding: '',
    childMargin: '',
  });

  useEffect(() => {
    if (!ref.current || !hovered || !debug) return;
    const style = window.getComputedStyle(ref.current);
    // Compute gap in px for flex/grid containers
    let gap = '0px';
    if (['flex', 'inline-flex', 'grid', 'inline-grid'].includes(style.display)) {
      gap = style.gap;
    }
    // Get first child element's margin/padding if present
    let childPadding = '';
    let childMargin = '';
    if (ref.current.firstElementChild) {
      const childStyle = window.getComputedStyle(ref.current.firstElementChild);
      childPadding = `${childStyle.paddingTop} ${childStyle.paddingRight} ${childStyle.paddingBottom} ${childStyle.paddingLeft}`;
      childMargin = `${childStyle.marginTop} ${childStyle.marginRight} ${childStyle.marginBottom} ${childStyle.marginLeft}`;
    }
    setMetrics({
      padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
      margin: `${style.marginTop} ${style.marginRight} ${style.marginBottom} ${style.marginLeft}`,
      gap,
      childPadding,
      childMargin,
    });
  }, [hovered, debug]);

  // Background colors based on nesting level - lighter shades for deeper nesting
  const backgroundColors = [
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-pink-50',
    'bg-purple-50',
    'bg-indigo-50',
  ];
  const backgroundColor = backgroundColors[(level - 1) % backgroundColors.length];

  const showDebug = debug && hovered;

  // Helper to check if a React element is a DebugWrapper
  function isDebugWrapperElement(
    element: React.ReactElement,
  ): element is React.ReactElement<DebugWrapperProps> {
    return element.type === DebugWrapper;
  }

  // Recursively clone children and increment level for DebugWrapper children
  function incrementLevelForChildren(
    children: React.ReactNode,
    level: number,
    debug: boolean,
  ): React.ReactNode {
    return React.Children.map(children, (child) => {
      if (isValidElement(child) && isDebugWrapperElement(child)) {
        return cloneElement(child, { level: level + 1, debug });
      }
      // If the child is a fragment, recurse into its children
      if (isValidElement(child) && child.type === React.Fragment) {
        return cloneElement(child, {
          children: incrementLevelForChildren(
            (child.props as { children?: React.ReactNode }).children,
            level,
            debug,
          ),
        } as any);
      }
      return child;
    });
  }

  // Auto-increment level for all DebugWrapper children (including arrays/fragments)
  const wrappedChildren = incrementLevelForChildren(children, level, debug);

  return (
    <div
      ref={ref}
      onMouseEnter={() => debug && setHovered(true)}
      onMouseLeave={() => debug && setHovered(false)}
      className={`relative ${className} ${debug ? backgroundColor : ''} ${showDebug ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
    >
      {showDebug && (
        <div className="absolute top-0 left-0 text-[10px] bg-black text-white px-2 py-1 rounded z-50 whitespace-nowrap shadow-lg">
          {label && <div className="font-semibold">{label}</div>}
          <div>Level: {level}</div>
          <div>Padding: {metrics.padding}</div>
          <div>Margin: {metrics.margin}</div>
          {metrics.gap && metrics.gap !== '0px' && <div>Gap: {metrics.gap}</div>}
          {metrics.childPadding && <div>Child Padding: {metrics.childPadding}</div>}
          {metrics.childMargin && <div>Child Margin: {metrics.childMargin}</div>}
        </div>
      )}
      {wrappedChildren}
    </div>
  );
}
