import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import * as donghuaService from "../services/donghua";

export const DonghuaContext = createContext();

export const DonghuaProvider = ({ children }) => {
  const [donghuaList, setDonghuaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchDonghua = async () => {
      console.log("🎬 Donghua fetch triggered:", { user: !!user, authLoading });

      // Only fetch if user is authenticated and auth is not loading
      if (user && !authLoading) {
        console.log("📡 Fetching donghua data...");
        setIsLoading(true);
        try {
          const data = await donghuaService.getAllDonghua();
          console.log("✅ Donghua data fetched:", data.length, "items");
          setDonghuaList(data);
          
          // Check for expired episodes after loading data
          try {
            const expiredResult = await donghuaService.checkAndUpdateExpiredEpisodes();
            if (expiredResult.updatedDonghua && expiredResult.updatedDonghua.length > 0) {
              console.log("🔄 Updated expired episodes:", expiredResult.updatedDonghua.length);
              // Refresh the donghua list to get updated data
              const refreshedData = await donghuaService.getAllDonghua();
              setDonghuaList(refreshedData);
            }
          } catch (expiredError) {
            console.error("❌ Error checking expired episodes:", expiredError);
          }
        } catch (error) {
          console.error("❌ Error fetching donghua:", error);
          setDonghuaList([]);
        } finally {
          console.log("🏁 Donghua fetch complete");
          setIsLoading(false);
        }
      } else if (!user && !authLoading) {
        // Clear data when user is not authenticated
        console.log("🧹 Clearing donghua data (no user)");
        setDonghuaList([]);
        setIsLoading(false);
      }
    };

    // Only run the effect if auth loading is complete
    if (!authLoading) {
      fetchDonghua();
    }
  }, [user, authLoading]);

  const addDonghua = async (donghuaData) => {
    const newDonghua = await donghuaService.addDonghua(donghuaData);
    setDonghuaList([...donghuaList, newDonghua]);
    return newDonghua;
  };

  const updateDonghua = async (id, updatedData) => {
    const updatedDonghua = await donghuaService.updateDonghua(id, updatedData);
    setDonghuaList(
      donghuaList.map((donghua) =>
        donghua._id === id ? updatedDonghua : donghua
      )
    );
    return updatedDonghua;
  };

  const deleteDonghua = async (id) => {
    await donghuaService.deleteDonghua(id);
    setDonghuaList(donghuaList.filter((donghua) => donghua._id !== id));
  };

  const refreshDonghua = async () => {
    if (user && !authLoading) {
      setIsLoading(true);
      try {
        const data = await donghuaService.getAllDonghua();
        setDonghuaList(data);
      } catch (error) {
        console.error("❌ Error refreshing donghua:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredDonghua = donghuaList.filter((donghua) => {
    const matchesStatusFilter =
      statusFilter === "all" || donghua.status === statusFilter;
    const matchesGenreFilter =
      genreFilter === "all" || donghua.genres.includes(genreFilter);
    const matchesSearch =
      donghua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donghua.chineseTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatusFilter && matchesGenreFilter && matchesSearch;
  });

  // Don't show loading for donghua if auth is still loading
  const shouldShowLoading = isLoading && !authLoading;

  return (
    <DonghuaContext.Provider
      value={{
        donghuaList: filteredDonghua,
        isLoading: shouldShowLoading,
        addDonghua,
        updateDonghua,
        deleteDonghua,
        refreshDonghua,
        setStatusFilter,
        setGenreFilter,
        setSearchQuery,
        statusFilter,
        genreFilter,
        searchQuery,
        // Keep backward compatibility
        filter: statusFilter,
        setFilter: setStatusFilter,
      }}
    >
      {children}
    </DonghuaContext.Provider>
  );
};

// Add this at the bottom of your existing DonghuaContext.jsx
export const useDonghua = () => {
  const context = useContext(DonghuaContext);
  if (!context) {
    throw new Error("useDonghua must be used within a DonghuaProvider");
  }
  return context;
};
