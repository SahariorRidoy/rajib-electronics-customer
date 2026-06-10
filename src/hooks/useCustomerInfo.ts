/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import {
  clearGuestData,
  saveGuestCustomerInfo,
  loadGuestCustomerInfo
} from "@/lib/localStorage";

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
}

const EMPTY_CUSTOMER_INFO: CustomerInfo = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export const useCustomerInfo = () => {
  const { user, isAuthed, isHydrated, token } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(EMPTY_CUSTOMER_INFO);
  const [isGuest, setIsGuest] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedAuthUser = useRef(false);
  const hasLoadedGuest = useRef(false);
  const previousAuthState = useRef(isAuthed);

  // Clear localStorage guest data when user becomes authenticated
  useEffect(() => {
    if (isAuthed && !previousAuthState.current) {
      clearGuestData();
      hasLoadedAuthUser.current = false;
      hasLoadedGuest.current = false;
    }
    previousAuthState.current = isAuthed;
  }, [isAuthed]);

  useEffect(() => {
    if (!isHydrated) return;

    // PRIORITY 1: Load authenticated user data
    if (isAuthed && user && token) {
      if (hasLoadedAuthUser.current) return;

      setIsLoading(true);
      setIsGuest(false);

      const API = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "";

      fetch(`${API}/customers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.ok && result.data) {
            const profileData = {
              name: result.data.name || user.name || "",
              phone: user.phone || result.data.phone || "",
              email: result.data.email || user.email || "",
              address: result.data.address || user.address || "",
            };
            setCustomerInfo(profileData);
          } else {
            setCustomerInfo({
              name: user.name || "",
              phone: user.phone || "",
              email: user.email || "",
              address: user.address || "",
            });
          }
          hasLoadedAuthUser.current = true;
        })
        .catch((err) => {
          console.warn("Failed to fetch profile, using Redux user data", err);
          setCustomerInfo({
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            address: user.address || "",
          });
          hasLoadedAuthUser.current = true;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // PRIORITY 2: Load guest data ONLY if definitely not authenticated
    else if (isHydrated && !isAuthed && !user && !token) {
      if (hasLoadedGuest.current) return;

      setIsGuest(true);

      const guestData = loadGuestCustomerInfo();

      if (guestData) {
        setCustomerInfo({
          name: guestData.name || "",
          phone: guestData.phone || "",
          email: guestData.email || "",
          address: guestData.address || "",
        });
      } else {
        setCustomerInfo(EMPTY_CUSTOMER_INFO);
      }
      hasLoadedGuest.current = true;
    }
  }, [user, isAuthed, isHydrated, token]);

  const saveCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info);

    if (isGuest) {
      saveGuestCustomerInfo(info);
    }
  };

  return {
    customerInfo,
    saveCustomerInfo,
    isGuest,
    isLoggedIn: isAuthed,
    user,
    isLoading,
  };
};
