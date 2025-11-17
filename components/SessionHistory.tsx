import React from 'react';
import type { SessionMetrics } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface SessionHistoryProps {
  history: SessionMetrics[];
  onBackToDashboard: () => void;
}

/**
 * A reusable card component for styling sections of the dashboard.
 */
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/50">
        <h3 className="text-lg font-bold text-brand-dark mb-4 text-center">{title}</h3>
        {children}
    </div>
);

/**
 * A simple SVG line chart component to visualize a trend over sessions.
 */
const LineChart: React.FC<{ data: { x: number, y: number }[] }> = ({ data }) => {
    // A trend requires at least two data points.
    if (data.length < 2) {
        return <div className="text-center text-gray-500 h-48 flex items-center justify-center">Not enough data to display a trend. Complete more sessions!</div>;
    }

    const PADDING = 40;
    const WIDTH = 400;
    const HEIGHT = 200;

    const maxX = data.length - 1;
    const maxY = Math.max(...data.map(d => d.y), 10); // Ensure Y-axis is at least 10.

    // Functions to scale data points to SVG coordinates.
    const getX = (x: number) => PADDING + (x / maxX) * (WIDTH - 2 * PADDING);
    const getY = (y: number) => HEIGHT - PADDING - (y / maxY) * (HEIGHT - 2 * PADDING);

    // Create the SVG path data string.
    const path = data.map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(point.x)} ${getY(point.y)}`).join(' ');

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
            {/* Y-axis labels and grid lines */}
            {[...Array(5)].map((_, i) => {
                const yValue = Math.round(maxY - (i * (maxY / 4)));
                const yPos = getY(yValue);
                return (
                    <g key={i}>
                        <text x={PADDING - 8} y={yPos + 5} textAnchor="end" className="text-xs fill-current text-gray-500">{yValue}</text>
                        <line x1={PADDING} y1={yPos} x2={WIDTH - PADDING} y2={yPos} className="stroke-current text-gray-200" strokeDasharray="2,2"/>
                    </g>
                );
            })}
             {/* X-axis labels (S1, S2, etc. for Session 1, Session 2) */}
            {data.map((point, i) => (
                <text key={i} x={getX(point.x)} y={HEIGHT - PADDING + 15} textAnchor="middle" className="text-xs fill-current text-gray-500">
                    S{i + 1}
                </text>
            ))}
            {/* The actual line path */}
            <path d={path} stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Data points on the line */}
            {data.map((point, i) => (
                <circle key={i} cx={getX(point.x)} cy={getY(point.y)} r="3" fill="#B89B2E" />
            ))}
        </svg>
    );
};

/**
 * A simple bar chart to display a score out of 100.
 */
const BarChart: React.FC<{ score: number }> = ({ score }) => {
    const widthPercentage = Math.max(0, Math.min(100, score));
    let color = 'bg-green-500';
    if (score < 40) color = 'bg-red-500';
    else if (score < 70) color = 'bg-yellow-500';

    return (
        <div className="w-full">
             <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-brand-dark">{score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
                 <div 
                    className={`${color} h-4 rounded-full transition-all duration-500 ease-out`} 
                    style={{ width: `${widthPercentage}%` }}
                ></div>
            </div>
        </div>
    )
};

/**
 * A component to display a word cloud of the user's most frequent strengths.
 */
const WordCloud: React.FC<{ words: string[] }> = ({ words }) => {
    // Calculate word frequencies.
    const wordFrequencies: Record<string, number> = words
        .flatMap(s => s.toLowerCase().replace(/[,.]/g, '').split(' '))
        .filter(word => word.length > 3 && !['your', 'with', 'that', 'this'].includes(word)) // Filter short/common words
        .reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    // Get the top 15 most frequent words.
    const sortedWords = Object.entries(wordFrequencies).sort((a, b) => b[1] - a[1]).slice(0, 15);
    
    if(sortedWords.length === 0) {
         return <div className="text-center text-gray-500">No recurring strengths identified yet.</div>;
    }
    
    const maxFreq = sortedWords[0]?.[1] || 1;
    const fontSizes = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {sortedWords.map(([word, freq]) => {
                // Scale font size based on frequency.
                const sizeIndex = Math.floor(((freq-1)/(maxFreq-1 || 1)) * (fontSizes.length - 1));
                return <span key={word} className={`${fontSizes[sizeIndex]} font-bold text-brand-gold-dark opacity-80`}>{word}</span>
            })}
        </div>
    )
};

/**
 * A component to display a single milestone, showing a locked or unlocked state.
 */
const Milestone: React.FC<{ title: string; description: string; achieved: boolean }> = ({ title, description, achieved }) => (
    <div className={`flex items-start gap-4 p-4 rounded-lg transition-all ${achieved ? 'bg-brand-gold/10' : 'bg-gray-100'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${achieved ? 'bg-brand-gold' : 'bg-gray-300'}`}>
            {achieved ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            }
        </div>
        <div>
            <h4 className={`font-bold ${achieved ? 'text-brand-gold-dark' : 'text-gray-600'}`}>{title}</h4>
            <p className={`text-sm ${achieved ? 'text-brand-dark' : 'text-gray-500'}`}>{description}</p>
        </div>
    </div>
);


/**
 * The SessionHistory component visualizes the user's performance and improvement
 * across all completed sessions.
 */
const SessionHistory: React.FC<SessionHistoryProps> = ({ history, onBackToDashboard }) => {
    const { t } = useTranslations();

    // Prepare data for the charts and components.
    const fillerData = history.map((s, i) => ({ x: i, y: s.fillerWordCount }));
    const latestMetrics = history[history.length - 1];
    const allStrengths = history.flatMap(s => s.strengths);

    // Define milestones and check if they have been achieved.
    const milestones = [
        { key: 'firstSession', achieved: history.length >= 1 },
        { key: 'fiveSessions', achieved: history.length >= 5 },
        { key: 'fillerWords', achieved: history.some(s => s.fillerWordCount < 5) },
    ];

    if (history.length === 0) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">{t('history.title')}</h2>
                <p className="text-gray-600 mb-6">{t('history.noSessions')}</p>
                <button onClick={onBackToDashboard} className="bg-brand-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-gold-dark transition-colors">
                    {t('button.backToDashboard')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('progress.title')}</h2>
                <p className="mt-3 text-lg text-gray-600">{t('progress.intro')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <ChartCard title={t('progress.chart.fillers.title')}>
                    <LineChart data={fillerData} />
                </ChartCard>
                 <div className="space-y-6">
                    <ChartCard title={t('progress.chart.vocalEnergy.title')}>
                        <BarChart score={latestMetrics?.vocalEnergyScore ?? 0} />
                    </ChartCard>
                     <ChartCard title={t('progress.chart.paceScore.title')}>
                        <BarChart score={latestMetrics?.paceScore ?? 0} />
                    </ChartCard>
                 </div>
            </div>
            
            <ChartCard title={t('progress.wordcloud.title')}>
                <WordCloud words={allStrengths} />
            </ChartCard>

            <div className="mt-8">
                <h3 className="text-2xl font-bold text-brand-dark mb-4 text-center">{t('progress.milestones.title')}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {milestones.map(m => (
                        <Milestone 
                            key={m.key} 
                            title={t(`progress.milestones.${m.key}.title`)} 
                            description={t(`progress.milestones.${m.key}.description`)}
                            achieved={m.achieved} 
                        />
                    ))}
                </div>
            </div>

            <div className="mt-12 text-center">
                <button
                onClick={onBackToDashboard}
                className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105"
                >
                {t('progress.button.back')}
                </button>
            </div>
        </div>
    );
};

export default SessionHistory;
