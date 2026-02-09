"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";

type ResizeDirection = 'corner' | 'horizontal' | 'vertical';

export function ResizableImageView({ node, updateAttributes, selected }: any) {
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || 600,
    height: node.attrs.height || null,
  });
  const imgRef = useRef<HTMLImageElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizeDirection = useRef<ResizeDirection>('corner');

  const handleMouseDown = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    resizeDirection.current = direction;
    
    // Get current dimensions
    const currentWidth = dimensions.width || imgRef.current?.offsetWidth || 600;
    const currentHeight = dimensions.height || imgRef.current?.offsetHeight || 400;
    
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: currentWidth,
      height: currentHeight,
    };
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      let newWidth = startPos.current.width;
      let newHeight = startPos.current.height;
      
      // Adjust based on resize direction
      if (resizeDirection.current === 'corner' || resizeDirection.current === 'horizontal') {
        newWidth = Math.max(100, Math.min(800, startPos.current.width + deltaX));
      }
      
      if (resizeDirection.current === 'corner' || resizeDirection.current === 'vertical') {
        newHeight = Math.max(50, Math.min(1000, startPos.current.height + deltaY));
      }
      
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      updateAttributes({
        width: dimensions.width,
        height: dimensions.height,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, dimensions, updateAttributes]);

  return (
    <NodeViewWrapper className="resizable-image-wrapper">
      <div
        className={`relative inline-block group ${selected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
        style={{ maxWidth: "100%" }}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          style={{
            width: dimensions.width ? `${dimensions.width}px` : "auto",
            height: dimensions.height ? `${dimensions.height}px` : "auto",
            maxWidth: "100%",
            display: "block",
            objectFit: "fill", // Allow stretching
          }}
          className="rounded"
        />
        
        {/* Resize handle - bottom right corner (both width and height) */}
        {selected && (
          <div
            onMouseDown={(e) => handleMouseDown(e, 'corner')}
            className={`
              absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white
              rounded-full cursor-nwse-resize shadow-lg
              opacity-0 group-hover:opacity-100 transition-opacity
              ${isResizing ? "opacity-100" : ""}
            `}
            style={{
              transform: "translate(50%, 50%)",
            }}
            title="Drag to resize width and height"
          />
        )}
        
        {/* Resize handle - bottom center (height only) */}
        {selected && (
          <div
            onMouseDown={(e) => handleMouseDown(e, 'vertical')}
            className={`
              absolute bottom-0 left-1/2 w-8 h-2 bg-blue-500 border border-white
              rounded cursor-ns-resize shadow-lg
              opacity-0 group-hover:opacity-100 transition-opacity
              ${isResizing ? "opacity-100" : ""}
            `}
            style={{
              transform: "translate(-50%, 50%)",
            }}
            title="Drag to adjust height"
          />
        )}
        
        {/* Resize handle - right center (width only) */}
        {selected && (
          <div
            onMouseDown={(e) => handleMouseDown(e, 'horizontal')}
            className={`
              absolute right-0 top-1/2 w-2 h-8 bg-blue-500 border border-white
              rounded cursor-ew-resize shadow-lg
              opacity-0 group-hover:opacity-100 transition-opacity
              ${isResizing ? "opacity-100" : ""}
            `}
            style={{
              transform: "translate(50%, -50%)",
            }}
            title="Drag to adjust width"
          />
        )}
        
        {/* Size indicator */}
        {selected && isResizing && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.round(dimensions.width)}px × {Math.round(dimensions.height)}px
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
