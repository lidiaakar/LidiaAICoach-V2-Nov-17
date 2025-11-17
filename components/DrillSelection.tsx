import React, { memo, useCallback } from 'react';
import { Drill } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface DrillSelectionProps {
    onDrillSelected: (drill: Drill) => void;
    onBackToDashboard: () => void;
}

// An array of available micro-practice drills.
// The keys correspond to entries in the translations file for internationalization.
const drills: Drill[] = [
    { id: 'filler', titleKey: 'drill.filler.title', descriptionKey: 'drill.filler.description', promptKey: 'drill.filler.prompt', duration: 60 },
    { id: 'pacing', titleKey: 'drill.pacing.title', descriptionKey: 'drill.pacing.description', promptKey: 'drill.pacing.prompt', contentKey: 'drill.pacing.content' },
    { id: 'concise', titleKey: 'drill.concise.title', descriptionKey: 'drill.concise.description', promptKey: 'drill.concise.prompt', duration: 30 },
];

const DrillCard: React.FC<{ drill: Drill, onSelect: (drill: Drill) => void }> = memo(({ drill, onSelect }) => {
    const { t } = useTranslations();
    const handleSelect = useCallback(() => {
        onSelect(drill);
    }, [drill, onSelect]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col justify-between transition-all hover:shadow-xl hover:border-brand-gold/50 hover:-translate-y-1">
            <div>
                <h3 className="text-xl font-bold text-brand-dark">{t(drill.titleKey!)}</h3>
                <p className="text-gray-600 mt-2 text-sm">{t(drill.descriptionKey!)}</p>
            </div>
            <button
                onClick={handleSelect}
                className="mt-6 bg-brand-gold text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-colors w-full"
            >
                {t('drill.button.start')}
            </button>
        </div>
    );
});


/**
 * The DrillSelection component displays a list of available micro-practice drills
 * for the user to choose from.
 * @param {DrillSelectionProps} props - The component props.
 * @param {(drill: Drill) => void} props.onDrillSelected - Callback to notify the parent component of the user's choice.
 */
const DrillSelection: React.FC<DrillSelectionProps> = ({ onDrillSelected, onBackToDashboard }) => {
    const { t } = useTranslations();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('drill.selection.title')}</h2>
                <p className="mt-3 text-lg text-gray-600">{t('drill.selection.intro')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Map over the drills and render a memoized card for each one. */}
                {drills.map((drill) => (
                   <DrillCard key={drill.id} drill={drill} onSelect={onDrillSelected} />
                ))}
            </div>

            <div className="mt-12 text-center">
                <button onClick={onBackToDashboard} className="text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('button.backToDashboard')}
                </button>
            </div>
        </div>
    );
};

export default DrillSelection;