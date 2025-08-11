import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DonationEligibility {
  isEligible: boolean;
  reasons: string[];
  nextEligibleDate?: Date;
}

interface RequestEligibility {
  isEligible: boolean;
  reasons: string[];
  requiredDocuments: string[];
}

interface HealthCriteria {
  age?: number;
  weight?: number;
  lastDonationDate?: Date;
  medicalConditions?: string[];
  medications?: string[];
  recentSurgery?: boolean;
  recentTattoo?: boolean;
  recentTravel?: boolean;
}

export const useEligibilityChecker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const checkDonationEligibility = async (healthData: HealthCriteria): Promise<DonationEligibility> => {
    setLoading(true);
    const reasons: string[] = [];
    let isEligible = true;
    let nextEligibleDate: Date | undefined;

    try {
      // Age eligibility (18-65 years)
      if (healthData.age) {
        if (healthData.age < 18) {
          isEligible = false;
          reasons.push('Must be at least 18 years old to donate');
        } else if (healthData.age > 65) {
          isEligible = false;
          reasons.push('Must be under 65 years old to donate');
        }
      }

      // Weight eligibility (minimum 50kg)
      if (healthData.weight && healthData.weight < 50) {
        isEligible = false;
        reasons.push('Must weigh at least 50kg to donate');
      }

      // Check time since last donation (56 days for whole blood)
      if (healthData.lastDonationDate) {
        const daysSinceLastDonation = Math.floor(
          (Date.now() - healthData.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastDonation < 56) {
          isEligible = false;
          const daysRemaining = 56 - daysSinceLastDonation;
          reasons.push(`Must wait ${daysRemaining} more days since last donation`);
          nextEligibleDate = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
        }
      }

      // Check for recent surgery (4 weeks minimum)
      if (healthData.recentSurgery) {
        isEligible = false;
        reasons.push('Cannot donate within 4 weeks of surgery');
      }

      // Check for recent tattoo/piercing (4 months minimum)
      if (healthData.recentTattoo) {
        isEligible = false;
        reasons.push('Cannot donate within 4 months of getting a tattoo or piercing');
      }

      // Check for recent travel to malaria-endemic areas
      if (healthData.recentTravel) {
        isEligible = false;
        reasons.push('Cannot donate within 3 months of travel to certain countries');
      }

      // Check medical conditions
      const excludingConditions = [
        'HIV', 'Hepatitis B', 'Hepatitis C', 'Syphilis', 'Cancer', 'Heart Disease'
      ];
      
      if (healthData.medicalConditions) {
        for (const condition of healthData.medicalConditions) {
          if (excludingConditions.some(exc => condition.toLowerCase().includes(exc.toLowerCase()))) {
            isEligible = false;
            reasons.push(`Cannot donate due to medical condition: ${condition}`);
          }
        }
      }

      // Check medications
      const excludingMedications = [
        'Aspirin', 'Warfarin', 'Antibiotics', 'Isotretinoin'
      ];
      
      if (healthData.medications) {
        for (const medication of healthData.medications) {
          if (excludingMedications.some(exc => medication.toLowerCase().includes(exc.toLowerCase()))) {
            isEligible = false;
            reasons.push(`Cannot donate while taking: ${medication}`);
          }
        }
      }

      return {
        isEligible,
        reasons,
        nextEligibleDate
      };

    } finally {
      setLoading(false);
    }
  };

  const checkRequestEligibility = async (urgencyLevel: 'routine' | 'urgent' | 'emergency'): Promise<RequestEligibility> => {
    setLoading(true);
    const reasons: string[] = [];
    const requiredDocuments: string[] = [];
    let isEligible = true;

    try {
      // Check if user has a valid profile
      if (!user) {
        isEligible = false;
        reasons.push('Must be logged in to request blood');
        return { isEligible, reasons, requiredDocuments };
      }

      // Check for existing pending requests
      const { data: existingRequests } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending');

      if (existingRequests && existingRequests.length > 0) {
        if (urgencyLevel !== 'emergency') {
          isEligible = false;
          reasons.push('You already have a pending blood request');
        }
      }

      // Required documents based on urgency
      switch (urgencyLevel) {
        case 'routine':
          requiredDocuments.push(
            'Medical prescription',
            'Blood type confirmation',
            'Valid ID',
            'Insurance documentation'
          );
          break;
        case 'urgent':
          requiredDocuments.push(
            'Medical prescription',
            'Hospital documentation',
            'Blood type confirmation',
            'Valid ID'
          );
          break;
        case 'emergency':
          requiredDocuments.push(
            'Emergency medical authorization',
            'Valid ID'
          );
          // Emergency requests have relaxed eligibility
          break;
      }

      // Check hospital capacity for urgent/emergency requests
      if (urgencyLevel === 'urgent' || urgencyLevel === 'emergency') {
        const { data: inventory } = await supabase
          .from('blood_inventory')
          .select('*');

        if (!inventory || inventory.length === 0) {
          isEligible = false;
          reasons.push('No blood inventory available for urgent requests');
        }
      }

      return {
        isEligible,
        reasons,
        requiredDocuments
      };

    } finally {
      setLoading(false);
    }
  };

  const checkAppointmentEligibility = async (): Promise<DonationEligibility> => {
    setLoading(true);
    const reasons: string[] = [];
    let isEligible = true;

    try {
      if (!user) {
        isEligible = false;
        reasons.push('Must be logged in to schedule appointments');
        return { isEligible, reasons };
      }

      // Check for existing appointments
      const { data: existingAppointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('donor_id', user.id)
        .eq('status', 'scheduled');

      if (existingAppointments && existingAppointments.length > 0) {
        isEligible = false;
        reasons.push('You already have a scheduled appointment');
      }

      // Check recent donations
      const { data: recentDonations } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.id)
        .order('donation_date', { ascending: false })
        .limit(1);

      if (recentDonations && recentDonations.length > 0) {
        const lastDonation = new Date(recentDonations[0].donation_date);
        const daysSinceLastDonation = Math.floor(
          (Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastDonation < 56) {
          isEligible = false;
          const daysRemaining = 56 - daysSinceLastDonation;
          reasons.push(`Must wait ${daysRemaining} more days since last donation`);
        }
      }

      return {
        isEligible,
        reasons
      };

    } finally {
      setLoading(false);
    }
  };

  return {
    checkDonationEligibility,
    checkRequestEligibility,
    checkAppointmentEligibility,
    loading
  };
};