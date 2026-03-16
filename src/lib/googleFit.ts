/**
 * Google Fit API Integration Stub
 * 
 * In a real-world scenario, you would:
 * 1. Register an OAuth app in Google Cloud Console
 * 2. Get a Client ID and add it to your .env
 * 3. Use this file to manage the OAuth flow and fetch data.
 * 
 * Because we don't have a Client ID for this environment,
 * this file provides a mock integration for the demo.
 */

import { supabase } from './supabase';

// Mock function to simulate connecting to Google Fit
export const connectGoogleFit = async (userId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Mock Google Fit Connected");
    return true;
};

// Mock function to simulate syncing data
export const syncSleepData = async (userId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate slightly randomized good sleep data
    const mockSleep = {
        sleep_hours: parseFloat((7 + Math.random() * 2).toFixed(1)), // Between 7.0 and 9.0
        sleep_quality: Math.floor(80 + Math.random() * 20), // Between 80 and 100
        mask_leaks: Math.random() > 0.8, // 20% chance of leaks
        heart_rate_avg: Math.floor(55 + Math.random() * 15), // Between 55 and 70
    };

    try {
        const { error } = await supabase.from('sleep_records').upsert({
            user_id: userId,
            date: new Date().toISOString().split('T')[0],
            source: 'google_fit',
            sleep_hours: mockSleep.sleep_hours,
            sleep_quality: mockSleep.sleep_quality,
            mask_leaks: mockSleep.mask_leaks,
            heart_rate_avg: mockSleep.heart_rate_avg
        }, { onConflict: 'user_id,date' });

        if (error) throw error;

        // In a full implementation, you'd also update user_stats here.
        return mockSleep;
    } catch (err) {
        console.error("Error syncing mock sleep data:", err);
        throw err;
    }
};
