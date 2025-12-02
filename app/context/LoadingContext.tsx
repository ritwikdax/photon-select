"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useIsFetching } from "@tanstack/react-query";

interface LoadingContextType {
  isInitialLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType>({
  isInitialLoading: true,
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const isFetching = useIsFetching();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasStartedFetching, setHasStartedFetching] = useState(false);

  useEffect(() => {
    // Track if we've started fetching
    if (isFetching > 0) {
      setHasStartedFetching(true);
    }
  }, [isFetching]);

  useEffect(() => {
    // Once queries are done loading for the first time, mark as loaded
    // Only consider it loaded if we've actually started fetching and now we're done
    if (isFetching === 0 && isInitialLoading && hasStartedFetching) {
      // Add a delay to ensure smooth transition and all renders are complete
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFetching, isInitialLoading, hasStartedFetching]);

  return (
    <LoadingContext.Provider value={{ isInitialLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
