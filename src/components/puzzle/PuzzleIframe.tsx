import { forwardRef } from "react";

interface PuzzleIframeProps {
  src: string;
  className?: string;
}

export const PuzzleIframe = forwardRef<HTMLIFrameElement, PuzzleIframeProps>(
  ({ src, className }, ref) => {
    return (
      <iframe 
        ref={ref}
        src={src} 
        width='100%' 
        height='100%' 
        frameBorder='0' 
        allowFullScreen
        className={className}
      />
    );
  }
);

PuzzleIframe.displayName = "PuzzleIframe";