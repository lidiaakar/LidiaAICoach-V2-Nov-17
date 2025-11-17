import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { SessionMaterial, RoleplayScenario } from '../types';

interface MaterialUploadProps {
  onComplete: (data: { material: SessionMaterial | null; customQuestions: string }) => void;
  onBack: () => void;
  selectedScenario: RoleplayScenario | null;
}

/**
 * A utility function to read a file and convert it to a Base64 string.
 * @param file The file to read.
 * @returns A promise that resolves with the Base64 string.
 */
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

/**
 * The MaterialUpload component allows users to upload session materials like
 * a presentation deck or document before starting their practice.
 */
const MaterialUpload: React.FC<MaterialUploadProps> = ({ onComplete, onBack, selectedScenario }) => {
    const { t } = useTranslations();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [customQuestions, setCustomQuestions] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isInterviewScenario = selectedScenario?.id === 'interview';

    /**
     * Handles the file selection event. Validates the file type and size,
     * then updates the state.
     */
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (file) {
            // Basic validation
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size must be less than 5MB.');
                return;
            }
            if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
                 setError('Invalid file type. Please upload a PDF, PNG, or JPG.');
                 return;
            }
            setSelectedFile(file);
        }
    }, []);

    /**
     * Triggered when the user clicks the final continue button.
     * It converts the file to Base64 (if any) and calls the onComplete callback
     * with both the material and any custom questions.
     */
    const handleComplete = useCallback(async () => {
        let material: SessionMaterial | null = null;
        if (selectedFile) {
            try {
                const base64Content = await toBase64(selectedFile);
                material = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    content: base64Content,
                };
            } catch (err) {
                console.error("Error converting file to Base64:", err);
                setError("Could not process the file. Please try again.");
                return;
            }
        }
        onComplete({ material, customQuestions });
    }, [selectedFile, customQuestions, onComplete]);

    // Simulates a click on the hidden file input element.
    const triggerFileSelect = useCallback(() => fileInputRef.current?.click(), []);

    const buttonText = useMemo(() => {
        const hasFile = !!selectedFile;
        const hasQuestions = customQuestions.trim() !== '';
        
        if (hasFile && hasQuestions) return t('material.upload.button.startWithBoth');
        if (hasFile) return t('material.upload.button.start');
        if (hasQuestions) return t('material.upload.button.startWithQuestions');
        return t('material.upload.button.skip');

    }, [selectedFile, customQuestions, t]);


    return (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('material.upload.title')}</h2>
            <p className="mt-3 text-lg text-gray-600">{t('material.upload.intro')}</p>
            
            <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200/50 space-y-6">
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="application/pdf,image/png,image/jpeg"
                    />
                    
                    <button
                        onClick={triggerFileSelect}
                        className="w-full bg-brand-gold/10 text-brand-gold-dark font-semibold py-4 px-6 rounded-lg hover:bg-brand-gold/20 transition-colors border-2 border-dashed border-brand-gold/50"
                    >
                        {t('material.upload.button.upload')}
                    </button>

                    {selectedFile && (
                        <p className="mt-4 text-gray-700 font-medium">
                            {t('material.upload.fileInfo', { fileName: selectedFile.name })}
                        </p>
                    )}
                </div>

                {isInterviewScenario && (
                     <div>
                        <label htmlFor="custom-questions" className="block text-lg font-semibold text-brand-dark mb-2">{t('material.upload.questions.title')}</label>
                        <textarea
                            id="custom-questions"
                            value={customQuestions}
                            onChange={(e) => setCustomQuestions(e.target.value)}
                            placeholder={t('material.upload.questions.placeholder')}
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold transition resize-y"
                            aria-label="Custom Interview Questions"
                        />
                    </div>
                )}

                {error && <p className="mt-4 text-red-500">{error}</p>}

                <div className="mt-6 flex flex-col items-center justify-center gap-4">
                    <button 
                        onClick={handleComplete} 
                        className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105 w-full sm:w-auto"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <button onClick={onBack} className="text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('button.backToScenarios')}
                </button>
            </div>
        </div>
    );
};

export default MaterialUpload;