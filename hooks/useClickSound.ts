import { useCallback, useRef } from 'react';

/**
 * Custom hook to play a click sound effect
 * 
 * @param soundPath - Path to the sound file (default: /assets/mouseClick.mp3)
 * @param volume - Volume level from 0 to 1 (default: 0.5)
 * @returns A function to play the sound
 * 
 * @example
 * ```tsx
 * const playClickSound = useClickSound();
 * 
 * <button onClick={() => {
 *   playClickSound();
 *   // your other logic
 * }}>
 *   Click me
 * </button>
 * ```
 */
export const useClickSound = (
  soundPath: string = '/assets/mouseClick.mp3',
  volume: number = 0.5
) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(soundPath);
        audioRef.current.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
      }

      // Reset and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // Silently handle autoplay restrictions
        console.debug('Audio play failed:', error);
      });
    } catch (error) {
      console.debug('Error playing sound:', error);
    }
  }, [soundPath, volume]);

  return playSound;
};
