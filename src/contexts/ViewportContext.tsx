import { createContext, useEffect, useState, ReactNode } from "react";

export interface ViewportContextType {
  isMobile: boolean;
  width: number;
  height: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

// Breakpoint 설정 (1024px 이하를 모바일로 간주)
const MOBILE_BREAKPOINT = 1024;

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기 크기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = viewport.width <= MOBILE_BREAKPOINT;

  return (
    <ViewportContext.Provider value={{ isMobile, width: viewport.width, height: viewport.height }}>
      {children}
    </ViewportContext.Provider>
  );
}
