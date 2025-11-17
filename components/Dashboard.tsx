import React from 'react';
import type { CoachingPlan, SessionMetrics } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface DashboardProps {
  plan: CoachingPlan;
  userName: string;
  progressHistory: SessionMetrics[];
  onStartSession: () => void;
  onStartRoleplay: () => void;
  onStartDrill: () => void;
  onStartStructuring: () => void;
  onStartLiveSession: () => void;
  onViewHistory: () => void;
}

// --- Icon Components ---
// FIX: Updated icon components to accept a `className` prop to resolve a TypeScript error with React.cloneElement.
const MicIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 11-14 0m7 7v3m0 0H9m6 0h-3m-3.5-7.042A7.96 7.96 0 005 11v2m14-2a7.96 7.96 0 00-2.5-5.042" /></svg>;
const UsersIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const TargetIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const LightbulbIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-gold" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const HistoryIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const WaveformIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h.008v.008H3.75V12zm.75 3h.008v.008H4.5v-.008zm.75-6h.008v.008H5.25v-.008zm.75 3h.008v.008H6v-.008zm.75 3h.008v.008h-.008v-.008zm.75-6h.008v.008h-.008V9zm.75 3h.008v.008h-.008v-.008zm.75 3h.008v.008h-.008V15zm.75-6h.008v.008h-.008V9zm.75 3h.008v.008h-.008v-.008zm.75 3h.008v.008h-.008v-.008zm.75-6h.008v.008h-.008V9zm.75 3h.008v.008h-.008v-.008zm.75 3h.008v.008h-.008v-.008zm.75-6h.008v.008h-.008V9zm.75 3h.008v.008h-.008v-.008zm.75 3h.008v.008h-.008v-.008zM20.25 12h.008v.008h-.008V12z" /></svg>;


// --- Reusable Card for Actions ---
const ActionCard: React.FC<{
  onClick: () => void;
  // FIX: Using a more specific ReactElement type to allow for cloning with a className prop,
  // which resolves the TypeScript overload error.
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  isPrimary?: boolean;
}> = ({ onClick, icon, title, description, isPrimary = false }) => {
  const { t } = useTranslations();
  const baseClasses = "group rounded-xl p-6 text-left transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex flex-col h-full";
  const primaryClasses = "bg-brand-gold text-white hover:bg-brand-gold-dark";
  const secondaryClasses = "bg-white text-brand-dark hover:bg-gray-50 border border-gray-200/80";
  const iconContainerClasses = `mb-4 w-14 h-14 rounded-xl flex items-center justify-center ${isPrimary ? 'bg-white/20' : 'bg-brand-gold/10'}`;
  const iconClasses = `h-8 w-8 ${isPrimary ? 'text-white' : 'text-brand-gold-dark'}`;

  return (
    <button onClick={onClick} className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses}`}>
      <div>
        <div className={iconContainerClasses}>
           {React.cloneElement(icon, { className: iconClasses })}
        </div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className={`text-sm ${isPrimary ? 'text-white/80' : 'text-gray-600'}`}>{description}</p>
      </div>
      <div className="mt-auto pt-4">
        <span className={`font-semibold text-sm transition-transform group-hover:translate-x-1 ${isPrimary ? 'text-white' : 'text-brand-gold-dark'}`}>
          {t('dashboard.button.startNow')} &rarr;
        </span>
      </div>
    </button>
  );
};

const getWeekNumber = (startDate: Date, currentDate: Date): number => {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const now = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
};

/**
 * The Dashboard component is the main view after onboarding.
 * It displays the user's personalized coaching plan and provides options
 * to start different types of practice sessions.
 */
const Dashboard: React.FC<DashboardProps> = ({ plan, userName, progressHistory, onStartSession, onStartRoleplay, onStartDrill, onStartStructuring, onStartLiveSession, onViewHistory }) => {
  const { t } = useTranslations();

  // --- Logic for Weekly Progress Tracking ---
  const planStartDate = plan.startDate ? new Date(plan.startDate) : new Date();
  const currentWeek = getWeekNumber(planStartDate, new Date());

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('dashboard.title', { name: userName })}</h2>
        <p className="mt-2 text-lg text-gray-600">{plan.title}</p>
      </div>
      
      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Primary Action Card */}
        <div className="md:col-span-2">
            <ActionCard
                onClick={onStartSession}
                icon={<MicIcon />}
                title={t('dashboard.button.start')}
                description={t('dashboard.button.start.desc')}
                isPrimary
            />
        </div>

        <ActionCard
            onClick={onStartLiveSession}
            icon={<WaveformIcon />}
            title={t('dashboard.button.live')}
            description={t('dashboard.button.live.desc')}
        />
        <ActionCard
            onClick={onViewHistory}
            icon={<HistoryIcon />}
            title={t('dashboard.button.history')}
            description={t('dashboard.button.history.desc')}
        />
        <ActionCard
            onClick={onStartRoleplay}
            icon={<UsersIcon />}
            title={t('dashboard.button.roleplay')}
            description={t('dashboard.button.roleplay.desc')}
        />
        <ActionCard
            onClick={onStartDrill}
            icon={<TargetIcon />}
            title={t('dashboard.button.drill')}
            description={t('dashboard.button.drill.desc')}
        />
         <div className="lg:col-span-2">
            <ActionCard
                onClick={onStartStructuring}
                icon={<LightbulbIcon />}
                title={t('dashboard.button.structure')}
                description={t('dashboard.button.structure.desc')}
            />
        </div>
      </div>


      {/* Display each week of the coaching plan */}
      <div className="mt-16">
         <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">{t('dashboard.plan.title')}</h3>
        <div className="space-y-6">
            {plan.weeks.map((week) => {
                const isCurrent = week.week === currentWeek;
                const weekStartDate = new Date(planStartDate);
                weekStartDate.setDate(weekStartDate.getDate() + (week.week - 1) * 7);
                const weekEndDate = new Date(weekStartDate);
                weekEndDate.setDate(weekEndDate.getDate() + 7);

                const sessionsInWeek = progressHistory.filter(session => {
                    const sessionDate = new Date(session.sessionId); // Using sessionId as it's an ISO string
                    return sessionDate >= weekStartDate && sessionDate < weekEndDate;
                });
                
                const avgPace = sessionsInWeek.length > 0 ? Math.round(sessionsInWeek.reduce((sum, s) => sum + s.paceScore, 0) / sessionsInWeek.length) : 0;
                const avgEnergy = sessionsInWeek.length > 0 ? Math.round(sessionsInWeek.reduce((sum, s) => sum + s.vocalEnergyScore, 0) / sessionsInWeek.length) : 0;

                return (
                    <div key={week.week} className={`p-6 rounded-xl shadow-lg border transition-all duration-300 ${isCurrent ? 'bg-white shadow-brand-gold/20 border-brand-gold/50' : 'bg-gray-50 border-gray-200/50'}`}>
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-sm font-semibold uppercase text-brand-gold-dark tracking-wider">{t('dashboard.week', { week: week.week })}</h3>
                                <p className="text-xl font-bold text-brand-dark mt-1">{week.title}</p>
                            </div>
                            {isCurrent && <span className="text-xs font-bold bg-brand-gold text-white py-1 px-3 rounded-full">{t('dashboard.plan.currentWeek')}</span>}
                        </div>
                        <p className="text-gray-600 mt-2">{week.focus}</p>
                        <div className="mt-4 border-t border-gray-200 pt-4 grid md:grid-cols-2 gap-6">
                           <div>
                                <h4 className="font-semibold text-brand-dark mb-2">{t('dashboard.tasks')}</h4>
                                <ul className="space-y-2">
                                    {week.tasks.map((task, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0"><CheckIcon /></div>
                                            <span className="text-gray-700">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                           </div>
                           <div className="bg-brand-gold/5 p-4 rounded-lg">
                                <h4 className="font-semibold text-brand-dark mb-3">{t('dashboard.plan.metrics.title')}</h4>
                                {sessionsInWeek.length > 0 ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-600">{t('dashboard.plan.metrics.sessions')}</span><span className="font-bold">{sessionsInWeek.length}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">{t('dashboard.plan.metrics.pace')}</span><span className="font-bold">{avgPace}/100</span></div>
                                        <div className="flex justify-between"><span className="text-gray-600">{t('dashboard.plan.metrics.energy')}</span><span className="font-bold">{avgEnergy}/100</span></div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.plan.metrics.noData')}</p>
                                )}
                           </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;