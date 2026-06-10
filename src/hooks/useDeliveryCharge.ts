import { useState, useEffect } from 'react';

interface DeliveryInfo {
  deliveryCharge: number;
  isFree: boolean;
  freeDeliveryThreshold: number;
}

export function useDeliveryCharge(cartSubtotal: number) {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartSubtotal <= 0) {
      setDeliveryInfo(null);
      return;
    }

    const controller = new AbortController();

    const fetchDelivery = async () => {
      setLoading(true);
      setError(null);

      try {
        const API = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${API}/delivery-charge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartAmount: cartSubtotal }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to fetch delivery charge');

        const data = await res.json();
        setDeliveryInfo(data.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('Delivery charge error:', err);
        setError('Failed to calculate delivery');
        setDeliveryInfo({ deliveryCharge: 0, isFree: true, freeDeliveryThreshold: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
    return () => controller.abort();
  }, [cartSubtotal]);

  return { deliveryInfo, loading, error };
}
