import React from 'react';
import { Heart, Coffee, Star } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../../stripe-config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DonateCardProps {
  title: string;
  description: string;
  amount: string;
  icon: React.ReactNode;
  primary?: boolean;
  onSelect: () => void;
}

const DonateCard: React.FC<DonateCardProps> = ({
  title,
  description,
  amount,
  icon,
  primary = false,
  onSelect
}) => {
  return (
    <div 
      className={`
        border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md
        ${primary 
          ? 'border-primary-300 bg-primary-50 hover:border-primary-400' 
          : 'border-neutral-200 bg-white hover:border-neutral-300'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`
            p-2 rounded-full mr-3
            ${primary ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'}
          `}>
            {icon}
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        {primary && (
          <div className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Popular
          </div>
        )}
      </div>
      
      <p className="text-neutral-600 mb-4 text-sm">{description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-semibold">{amount}</span>
        <button 
          className={`btn ${primary ? 'btn-primary' : 'btn-outline'}`}
        >
          Select
        </button>
      </div>
    </div>
  );
};

const DonateCardList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleDonate = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/donate/success`,
          cancel_url: `${window.location.origin}/donate`,
          mode,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DonateCard
        title={STRIPE_PRODUCTS.DONATION_5.name}
        description={STRIPE_PRODUCTS.DONATION_5.description}
        amount="$5"
        icon={<Coffee size={20} />}
        onSelect={() => handleDonate(STRIPE_PRODUCTS.DONATION_5.priceId, STRIPE_PRODUCTS.DONATION_5.mode)}
      />
      <DonateCard
        title={STRIPE_PRODUCTS.DONATION_10.name}
        description={STRIPE_PRODUCTS.DONATION_10.description}
        amount="$10"
        icon={<Heart size={20} />}
        primary={true}
        onSelect={() => handleDonate(STRIPE_PRODUCTS.DONATION_10.priceId, STRIPE_PRODUCTS.DONATION_10.mode)}
      />
      <DonateCard
        title={STRIPE_PRODUCTS.DONATION_25.name}
        description={STRIPE_PRODUCTS.DONATION_25.description}
        amount="$25"
        icon={<Star size={20} />}
        onSelect={() => handleDonate(STRIPE_PRODUCTS.DONATION_25.priceId, STRIPE_PRODUCTS.DONATION_25.mode)}
      />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <p>Processing your donation...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateCardList;