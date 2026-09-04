import { useState, useEffect } from 'react';

export type DeliveryZone = 'inside' | 'outside';

interface DeliveryInfo {
  deliveryCharge: number;
  isFree: boolean;
  freeDeliveryThreshold: number;
  insideDhakaCharge: number;
  outsideDhakaCharge: number;
  zone: DeliveryZone;
  deliveryChargePaymentRequired: boolean;
}

export function useDeliveryCharge(cartSubtotal: number, zone: DeliveryZone = 'outside') {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDelivery = async () => {
      setLoading(true);
      setError(null);
      try {
        const API = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API}/delivery-charge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartAmount: Math.max(0, cartSubtotal), zone }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch delivery charge');
        const data = await res.json();
        setDeliveryInfo(data.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Delivery charge error:', err);
        setError('Failed to calculate delivery');
        setDeliveryInfo({
          deliveryCharge: zone === 'inside' ? 80 : 120,
          isFree: false,
          freeDeliveryThreshold: 0,
          insideDhakaCharge: 80,
          outsideDhakaCharge: 120,
          zone,
          deliveryChargePaymentRequired: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
    return () => controller.abort();
  }, [cartSubtotal, zone]);

  return { deliveryInfo, loading, error };
}
