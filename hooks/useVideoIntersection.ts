import { useEffect, RefObject } from "react";

/**
 * Custom hook to handle video play/pause based on viewport intersection
 * @param videoRefs - Array of video element refs to observe
 * @param threshold - Intersection threshold (default: 0.5)
 * @param playbackRate - Playback rate when video is in view (default: 0.5)
 */
export function useVideoIntersection(
  videoRefs: RefObject<(HTMLVideoElement | null)[]>,
  threshold: number = 0.5,
  playbackRate: number = 0.5,
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Find the index of the observed element in videoRefs
          const index = videoRefs.current?.findIndex(
            (video) => video === entry.target,
          );

          if (index !== undefined && index !== -1 && videoRefs.current) {
            const videoElement = videoRefs.current[index];

            if (videoElement) {
              if (entry.isIntersecting) {
                videoElement.play().catch(() => {
                  // Silently handle autoplay restrictions
                });
                videoElement.playbackRate = playbackRate;
              } else {
                videoElement.pause();
                videoElement.playbackRate = 1;
              }
            }
          }
        });
      },
      { threshold },
    );

    // Observing all video elements
    videoRefs.current?.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [videoRefs, threshold, playbackRate]);
}
