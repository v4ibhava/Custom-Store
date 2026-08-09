import { useState, useEffect, useCallback } from "react";
import { settingsService } from "../services";

// Helper to read cached visual settings
const getCachedVisuals = () => {
  try {
    const cached = JSON.parse(localStorage.getItem('ca_visual'));
    if (cached) {
      return {
        colorTheme: cached.colorTheme || 'blush',
        uiStyle: cached.uiStyle || 'curvy',
        darkMode: !!cached.darkMode
      };
    }
  } catch (e) {}
  return { colorTheme: 'blush', uiStyle: 'curvy', darkMode: false };
};

// Helper to apply all visual settings to <html> and cache in localStorage
const applyVisualSettings = (s) => {
  const root = document.documentElement;
  if (s.colorTheme) root.setAttribute('data-theme', s.colorTheme);
  if (s.uiStyle) root.setAttribute('data-style', s.uiStyle);
  if (s.darkMode !== undefined) root.setAttribute('data-mode', s.darkMode ? 'dark' : 'light');
  
  try {
    localStorage.setItem('ca_visual', JSON.stringify({
      colorTheme: s.colorTheme || 'blush',
      uiStyle: s.uiStyle || 'curvy',
      darkMode: !!s.darkMode
    }));
  } catch (_) {}
};

// Apply cached visual settings immediately
applyVisualSettings(getCachedVisuals());

const useSettingsAPI = () => {
  const initialVisuals = getCachedVisuals();

  const [settings, setSettings] = useState({
    storeName: 'Cake Avenue',
    tagline: 'Handcrafted Fresh Baked Delights',
    supportEmail: 'support@cakeavenue.com',
    supportPhone: '+91 98765 43210',
    address: '123 Bakery Lane, Sweet City',
    googleMapsUrl: '',
    googleMapsText: 'View Store on Google Maps',
    currencySymbol: '₹',
    currencyCode: 'INR',
    colorTheme: initialVisuals.colorTheme,
    uiStyle: initialVisuals.uiStyle,
    darkMode: initialVisuals.darkMode,
    minOrderAmount: 0,
    flatDeliveryFee: 0,
    freeDeliveryThreshold: 500,
    isRazorpayEnabled: true,
    isCodEnabled: true,
    isMaintenanceMode: false
  });

  const getSettings = useCallback(async () => {
    try {
      const data = await settingsService.getSettings();
      if (data) {
        const cached = getCachedVisuals();
        // Prefer explicit DB settings if available, else keep cached preference
        const mergedData = {
          ...data,
          colorTheme: data.colorTheme || cached.colorTheme,
          uiStyle: data.uiStyle || cached.uiStyle,
          darkMode: data.darkMode !== undefined ? data.darkMode : cached.darkMode
        };
        setSettings(prev => ({ ...prev, ...mergedData }));
        applyVisualSettings(mergedData);
      }
    } catch (err) {
      console.error("Failed to load store settings API:", err.message);
    }
  }, []);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  // Re-apply whenever any visual setting changes
  useEffect(() => {
    applyVisualSettings(settings);
  }, [settings.colorTheme, settings.uiStyle, settings.darkMode]);

  return {
    settings: [settings, setSettings],
    getSettings
  };
};

export default useSettingsAPI;
