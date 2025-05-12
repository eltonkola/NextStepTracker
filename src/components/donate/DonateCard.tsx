import React from 'react';
import { Heart, Coffee, Star } from 'lucide-react';

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
  // This would be handled by a payment provider in a real app
  const handleDonate = (amount: string) => {
    alert(`Thank you for your donation of ${amount}! This would integrate with a payment provider in a real application.`);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DonateCard
        title="Small Thanks"
        description="A token of appreciation for the app. Every bit helps!"
        amount="$5"
        icon={<Coffee size={20} />}
        onSelect={() => handleDonate("$5")}
      />
      <DonateCard
        title="Big Thanks"
        description="Thanks for making job tracking easier and helping with ongoing development."
        amount="$10"
        icon={<Heart size={20} />}
        primary={true}
        onSelect={() => handleDonate("$10")}
      />
      <DonateCard
        title="Huge Thanks"
        description="Wow! Your generosity helps fund new features and improvements."
        amount="$25"
        icon={<Star size={20} />}
        onSelect={() => handleDonate("$25")}
      />
    </div>
  );
};

export default DonateCardList;