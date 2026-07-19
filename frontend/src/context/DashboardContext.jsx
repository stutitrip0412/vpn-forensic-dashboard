import { createContext, useEffect, useState } from "react";

import { fetchDashboardData } from "../services/dashboard.service";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {

        try {

            const data = await fetchDashboardData();

            setDashboard(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    // Initial load
    load();

    // Refresh every 30 seconds
    const interval = setInterval(load, 30000);

    // Cleanup on unmount
    return () => clearInterval(interval);

}, []);

    return (
        <DashboardContext.Provider
            value={{
                dashboard,
                loading,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};