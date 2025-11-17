import { useRef, useCallback } from 'react';
import { AudioMetrics } from '../types';

// FIX: Add `webkitAudioContext` to the window type to resolve a TypeScript error
// and ensure cross-browser compatibility for the Web Audio API.
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// The size of the Fast Fourier Transform (FFT) to use for frequency analysis.
// Must be a power of 2. Larger sizes provide more frequency resolution.
const FFT_SIZE = 2048;

/**
 * Calculates the standard deviation of an array of numbers.
 * @param array The array of numbers.
 * @returns The standard deviation.
 */
const getStandardDeviation = (array: number[]): number => {
    if (array.length === 0) return 0;
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
};

/**
 * A simple pitch detection algorithm that finds the peak in the frequency spectrum.
 * @param analyser The AnalyserNode providing the frequency data.
 * @param buffer The buffer to store the frequency data.
 * @param sampleRate The sample rate of the audio context.
 * @returns The estimated pitch in Hertz (Hz).
 */
const getPitch = (analyser: AnalyserNode, buffer: Float32Array, sampleRate: number): number => {
    analyser.getFloatFrequencyData(buffer);
    let maxVal = -Infinity;
    let maxIdx = -1;

    // Find the frequency bin with the highest energy.
    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] > maxVal) {
            maxVal = buffer[i];
            maxIdx = i;
        }
    }
    // Convert the index of the frequency bin to a frequency in Hz.
    return (maxIdx * sampleRate) / FFT_SIZE;
};

/**
 * A custom hook to perform real-time audio analysis on a MediaStream using the Web Audio API.
 * It calculates objective metrics for vocal pitch and volume variation.
 * @returns An object with functions to start and stop the analysis.
 */
export const useAudioAnalysis = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const pitchDataRef = useRef<number[]>([]); // Stores collected pitch data points.
    const volumeDataRef = useRef<number[]>([]); // Stores collected volume data points.

    /**
     * Sets up the Web Audio API nodes and starts the analysis loop.
     * @param streamForAnalysis The dedicated MediaStream for audio analysis.
     */
    const startAnalysis = useCallback((streamForAnalysis: MediaStream | null) => {
        if (!streamForAnalysis || streamForAnalysis.getAudioTracks().length === 0) {
            console.warn('Audio analysis cannot start without an audio stream.');
            return;
        }

        // Create an AudioContext and connect the media stream to it.
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(streamForAnalysis);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Reset data arrays for the new session.
        pitchDataRef.current = [];
        volumeDataRef.current = [];

        const frequencyData = new Float32Array(analyser.frequencyBinCount);
        const timeDomainData = new Uint8Array(analyser.frequencyBinCount);

        /**
         * The main analysis loop, run on every animation frame for performance.
         */
        const analyze = () => {
            if (!analyserRef.current) return;

            // --- Calculate Volume (Root Mean Square) ---
            analyserRef.current.getByteTimeDomainData(timeDomainData);
            let sumSquares = 0.0;
            for (const amplitude of timeDomainData) {
                const val = (amplitude / 128.0) - 1.0; // convert to a range of -1 to 1
                sumSquares += val * val;
            }
            const rms = Math.sqrt(sumSquares / timeDomainData.length);
            // A simple noise gate to avoid capturing silence/background noise.
             if (rms > 0.01) { 
                volumeDataRef.current.push(rms * 100); // Scale for more intuitive numbers
            }

            // --- Calculate Pitch ---
            const pitch = getPitch(analyserRef.current, frequencyData, audioContext.sampleRate);
            // Filter for a typical human voice range to exclude noise and harmonics.
            if (pitch > 80 && pitch < 300) { 
                pitchDataRef.current.push(pitch);
            }

            // Schedule the next analysis frame.
            animationFrameRef.current = requestAnimationFrame(analyze);
        };
        analyze();
    }, []);

    /**
     * Stops the analysis loop, closes the AudioContext, and calculates the final metrics.
     * @returns The calculated AudioMetrics object.
     */
    const stopAnalysis = useCallback((): AudioMetrics => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }

        // Calculate the standard deviation of the collected data points.
        const pitchVariation = getStandardDeviation(pitchDataRef.current);
        const volumeVariation = getStandardDeviation(volumeDataRef.current);
        
        // Return the final metrics, handling potential NaN values.
        return {
            pitchVariation: isNaN(pitchVariation) ? 0 : pitchVariation,
            volumeVariation: isNaN(volumeVariation) ? 0 : volumeVariation
        };
    }, []);

    return { startAnalysis, stopAnalysis };
};