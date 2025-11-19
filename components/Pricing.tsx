import React, { useState } from 'react';
import { useTranslations } from '../contexts/LanguageContext';

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


/**
 * The Pricing component displays the available subscription plans to the user.
 * @param {PricingProps} props - The component props.
 * @param {function} props.onSelectPlan - Callback to notify the App component which plan was selected.
 */
const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const { t } = useTranslations();
  const [view, setView] = useState<'individual' | 'b2b'>('individual');

  const individualPlans = [
    {
      name: 'Free',
      title: t('pricing.free.title'),
      price: t('pricing.free.price'),
      description: t('pricing.free.description'),
      features: [
        t('pricing.free.feature1'),
        t('pricing.free.feature2'),
        t('pricing.free.feature3'),
        t('pricing.free.feature4'),
      ],
      buttonText: t('pricing.button.choose'),
      isPopular: false,
    },
    {
      name: 'Pro',
      title: t('pricing.pro.title'),
      price: t('pricing.pro.price'),
      description: t('pricing.pro.description'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
        t('pricing.pro.feature5'),
        t('pricing.pro.feature6'),
      ],
      buttonText: t('pricing.button.choose'),
      isPopular: true,
    },
    {
      name: 'Enterprise',
      title: t('pricing.enterprise.title'),
      price: t('pricing.enterprise.price'),
      description: t('pricing.enterprise.description'),
      features: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
        t('pricing.enterprise.feature4'),
        t('pricing.enterprise.feature5'),
      ],
      buttonText: t('pricing.button.contact'),
      isPopular: false,
    },
  ];
  
  const b2bPlans = [
    {
      name: 'Teams',
      title: t('pricing.teams.title'),
      price: t('pricing.teams.price'),
      description: t('pricing.teams.description'),
      features: [
        t('pricing.teams.feature1'),
        t('pricing.teams.feature2'),
        t('pricing.teams.feature3'),
        t('pricing.teams.feature4'),
      ],
      buttonText: t('pricing.button.choose'),
      isPopular: false,
    },
    {
      name: 'Business',
      title: t('pricing.business.title'),
      price: t('pricing.business.price'),
      description: t('pricing.business.description'),
      features: [
        t('pricing.business.feature1'),
        t('pricing.business.feature2'),
        t('pricing.business.feature3'),
        t('pricing.business.feature4'),
        t('pricing.business.feature5'),
      ],
      buttonText: t('pricing.button.choose'),
      isPopular: true,
    },
    {
      name: 'EnterpriseB2B',
      title: t('pricing.enterprise.b2b.title'),
      price: t('pricing.enterprise.price'),
      description: t('pricing.enterprise.b2b.description'),
      features: [
        t('pricing.enterprise.b2b.feature1'),
        t('pricing.enterprise.b2b.feature2'),
        t('pricing.enterprise.b2b.feature3'),
        t('pricing.enterprise.b2b.feature4'),
        t('pricing.enterprise.b2b.feature5'),
      ],
      buttonText: t('pricing.button.contact'),
      isPopular: false,
    },
  ];

  const plansToDisplay = view === 'individual' ? individualPlans : b2bPlans;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('pricing.title')}</h2>
        <p className="mt-4 text-lg text-gray-600">{t('pricing.intro')}</p>

        <div className="mt-8 inline-flex bg-gray-100 p-1 rounded-full">
            <button
                onClick={() => setView('individual')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${view === 'individual' ? 'bg-white text-brand-dark shadow' : 'text-gray-600'}`}
            >
                {t('pricing.b2b.toggle.individual')}
            </button>
            <button
                onClick={() => setView('b2b')}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${view === 'b2b' ? 'bg-white text-brand-dark shadow' : 'text-gray-600'}`}
            >
                {t('pricing.b2b.toggle.b2b')}
            </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {plansToDisplay.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl p-8 shadow-lg border transition-transform duration-300 h-full flex flex-col ${plan.isPopular ? 'border-brand-gold-dark scale-105 shadow-brand-gold/20' : 'border-gray-200/80 hover:-translate-y-2'}`}
          >
            {plan.isPopular && (
              <div className="text-center mb-4">
                <span className="bg-brand-gold-dark text-white text-xs font-bold px-4 py-1 rounded-full uppercase">{t('pricing.pro.popular')}</span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-center text-brand-dark">{plan.title}</h3>
            <p className="text-4xl font-extrabold text-center my-4 text-brand-dark">{plan.price}</p>
            <p className="text-gray-600 text-center h-16">{plan.description}</p>
            <ul className="space-y-4 my-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelectPlan(plan.name)}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors mt-auto ${plan.isPopular ? 'bg-brand-gold text-white hover:bg-brand-gold-dark' : 'bg-brand-gold/10 text-brand-gold-dark hover:bg-brand-gold/20'}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;