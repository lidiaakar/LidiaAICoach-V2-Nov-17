import React, { useCallback, memo } from 'react';
import { RoleplayScenario } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface RoleplaySelectionProps {
    onScenarioSelected: (scenario: RoleplayScenario) => void;
    onBackToDashboard: () => void;
}

// An array of available roleplay scenarios.
// The keys (e.g., 'titleKey') correspond to entries in the translations file.
const scenarios: RoleplayScenario[] = [
    { id: 'interview', titleKey: 'roleplay.scenario.interview.title', descriptionKey: 'roleplay.scenario.interview.description', systemPromptKey: 'roleplay.scenario.interview.prompt' },
    { id: 'pitch', titleKey: 'roleplay.scenario.pitch.title', descriptionKey: 'roleplay.scenario.pitch.description', systemPromptKey: 'roleplay.scenario.pitch.prompt' },
    { id: 'panel', titleKey: 'roleplay.scenario.panel.title', descriptionKey: 'roleplay.scenario.panel.description', systemPromptKey: 'roleplay.scenario.panel.prompt' },
];

const ScenarioCard: React.FC<{ scenario: RoleplayScenario, onSelect: (scenario: RoleplayScenario) => void }> = memo(({ scenario, onSelect }) => {
    const { t } = useTranslations();
    const handleSelect = useCallback(() => {
        onSelect(scenario);
    }, [scenario, onSelect]);
    
    return (
         <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col justify-between transition-all hover:shadow-xl hover:border-brand-gold/50 hover:-translate-y-1">
            <div>
                <h3 className="text-xl font-bold text-brand-dark">{t(scenario.titleKey)}</h3>
                <p className="text-gray-600 mt-2 text-sm">{t(scenario.descriptionKey)}</p>
            </div>
            <button
                onClick={handleSelect}
                className="mt-6 bg-brand-gold text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-colors w-full"
            >
                {t('roleplay.button.start')}
            </button>
        </div>
    );
});


/**
 * The RoleplaySelection component displays a list of available roleplay scenarios
 * for the user to choose from.
 * @param {RoleplaySelectionProps} props - The component props.
 * @param {(scenario: RoleplayScenario) => void} props.onScenarioSelected - Callback function to notify the parent component of the user's choice.
 */
const RoleplaySelection: React.FC<RoleplaySelectionProps> = ({ onScenarioSelected, onBackToDashboard }) => {
    const { t } = useTranslations();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('roleplay.selection.title')}</h2>
                <p className="mt-3 text-lg text-gray-600">{t('roleplay.selection.intro')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Map over the scenarios and render a card for each one. */}
                {scenarios.map((scenario) => (
                    <ScenarioCard key={scenario.id} scenario={scenario} onSelect={onScenarioSelected} />
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

export default RoleplaySelection;