import React, { useEffect, useState } from "react";

interface FishCageProps {
  fish?: string; // SVG 이미지 경로
  isSelected: boolean;
}

const FishCage: React.FC<FishCageProps> = ({ fish, isSelected }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const [pos, setPos] = useState({ x: 50, y: 55 });
  const [facing, setFacing] = useState(1);
  const isQuestion = fish?.includes("questionSquare");

  // 1. SVG 소스 가져오기 (애니메이션 활성화를 위해 인라이닝)
  useEffect(() => {
    if (!fish || isQuestion) {
      setSvgContent("");
      return;
    }
    fetch(fish)
      .then((res) => res.text())
      .then((data) => {
        const uniqueId = Math.random().toString(36).substr(2, 9);
        setSvgContent(data.replaceAll(/\*\{id\}/g, uniqueId));
      })
      .catch((err) => console.error("SVG fetch error:", err));
  }, [fish, isQuestion]);

  // 2. 어항 내부 이동 로직
  useEffect(() => {
    // 선택되었거나 물음표일 때는 이동하지 않고 중앙 고정
    if (isSelected || isQuestion || !fish) {
      setPos({ x: 50, y: 55 });
      return;
    }

    let cancelled = false;

    const move = async () => {
      while (!cancelled && !isSelected) {
        const targetX = Math.random() * 40 + 30; // 30% ~ 70% 사이
        const targetY = Math.random() * 20 + 40; // 40% ~ 60% 사이

        // 함수형 업데이트를 사용하여 의존성 문제 해결
        setPos((prev) => {
          const dx = targetX - prev.x;
          if (Math.abs(dx) > 1) {
            setFacing(dx > 0 ? 1 : -1);
          }
          return { x: targetX, y: targetY };
        });

        // 랜덤한 대기 시간
        await new Promise((res) => setTimeout(res, Math.random() * 2000 + 2000));
      }
    };

    move();

    return () => {
      cancelled = true;
    };
  }, [isSelected, fish, isQuestion]);

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      {/* 어항 틀 */}
      <img
        src="/images/collection/fishcagecut.png"
        alt="cage"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      />

      {/* 물고기 영역 */}
      <div
        className={`pointer-events-none absolute flex items-center justify-center transition-all duration-1000 ease-in-out ${
          isSelected ? "z-10 h-20 w-20" : "z-0 h-12 w-12"
        }`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: `translate(-50%, -50%) scaleX(${facing})`,
        }}
      >
        {isQuestion ? (
          <img
            src={fish}
            alt="locked"
            className="h-15 w-15 object-contain pb-1 opacity-80 grayscale"
          />
        ) : (
          <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: svgContent }} />
        )}
      </div>
    </div>
  );
};

export default FishCage;
