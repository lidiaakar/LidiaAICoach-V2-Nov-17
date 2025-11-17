import React from 'react';
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

  const plans = [
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

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{t('pricing.title')}</h2>
        <p className="mt-4 text-lg text-gray-600">{t('pricing.intro')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl p-8 shadow-lg border transition-transform duration-300 ${plan.isPopular ? 'border-brand-gold-dark scale-105 shadow-brand-gold/20' : 'border-gray-200/80 hover:-translate-y-2'}`}
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
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${plan.isPopular ? 'bg-brand-gold text-white hover:bg-brand-gold-dark' : 'bg-brand-gold/10 text-brand-gold-dark hover:bg-brand-gold/20'}`}
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
