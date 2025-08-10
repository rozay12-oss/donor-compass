import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BloodInventoryData {
  id: number;
  blood_type: string;
  quantity: number;
  capacity: number;
  updated_at: string;
}

export interface BloodAvailability {
  bloodType: string;
  availableUnits: number;
  capacity: number;
  pendingRequests: number;
  isAvailable: boolean;
  stockLevel: 'critical' | 'low' | 'good';
}

export const useBloodInventory = () => {
  const [inventory, setInventory] = useState<BloodInventoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_inventory')
        .select('*')
        .order('blood_type');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching blood inventory:', error);
      toast.error('Failed to fetch blood inventory');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (bloodType: string, requiredUnits: number = 1): Promise<BloodAvailability | null> => {
    try {
      // Get inventory for specific blood type
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('blood_inventory')
        .select('*')
        .eq('blood_type', bloodType)
        .single();

      if (inventoryError && inventoryError.code !== 'PGRST116') {
        throw inventoryError;
      }

      // Get pending requests for this blood type
      const { data: requestsData, error: requestsError } = await supabase
        .from('blood_requests')
        .select('quantity')
        .eq('blood_type', bloodType)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      const availableUnits = inventoryData?.quantity || 0;
      const capacity = inventoryData?.capacity || 100;
      const pendingRequests = requestsData?.reduce((sum, req) => sum + req.quantity, 0) || 0;
      
      const stockPercentage = (availableUnits / capacity) * 100;
      let stockLevel: 'critical' | 'low' | 'good' = 'good';
      
      if (stockPercentage < 20) stockLevel = 'critical';
      else if (stockPercentage < 40) stockLevel = 'low';

      return {
        bloodType,
        availableUnits,
        capacity,
        pendingRequests,
        isAvailable: availableUnits >= requiredUnits,
        stockLevel
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error(`Failed to check availability for ${bloodType}`);
      return null;
    }
  };

  const checkCompatibleBloodTypes = async (patientBloodType: string): Promise<BloodAvailability[]> => {
    // Blood compatibility matrix
    const compatibilityMap: { [key: string]: string[] } = {
      'O-': ['O-'],
      'O+': ['O-', 'O+'],
      'A-': ['O-', 'A-'],
      'A+': ['O-', 'O+', 'A-', 'A+'],
      'B-': ['O-', 'B-'],
      'B+': ['O-', 'O+', 'B-', 'B+'],
      'AB-': ['O-', 'A-', 'B-', 'AB-'],
      'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };

    const compatibleTypes = compatibilityMap[patientBloodType] || [];
    const availabilityPromises = compatibleTypes.map(type => checkAvailability(type));
    const results = await Promise.all(availabilityPromises);
    
    return results.filter(result => result !== null) as BloodAvailability[];
  };

  const getBloodInventoryWithRequests = async () => {
    try {
      // Get all blood inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('blood_inventory')
        .select('*')
        .order('blood_type');

      if (inventoryError) throw inventoryError;

      // Get all pending requests grouped by blood type
      const { data: requestsData, error: requestsError } = await supabase
        .from('blood_requests')
        .select('blood_type, quantity')
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      // Combine inventory with request data
      const enrichedInventory = inventoryData?.map(item => {
        const requests = requestsData?.filter(req => req.blood_type === item.blood_type) || [];
        const totalRequests = requests.reduce((sum, req) => sum + req.quantity, 0);
        
        return {
          ...item,
          pendingRequests: totalRequests,
          requestCount: requests.length
        };
      }) || [];

      return enrichedInventory;
    } catch (error) {
      console.error('Error fetching enriched inventory:', error);
      toast.error('Failed to fetch inventory data');
      return [];
    }
  };

  useEffect(() => {
    fetchInventory();

    // Set up real-time subscription for inventory updates
    const channel = supabase
      .channel('blood-inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blood_inventory'
        },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    inventory,
    loading,
    checkAvailability,
    checkCompatibleBloodTypes,
    getBloodInventoryWithRequests,
    refetch: fetchInventory
  };
};