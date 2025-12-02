import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { TankContext } from "@/contexts/TankContext";

type Props = {
  id: string;
  svgSource: string; // *{id} 포함
  label?: string;
  personaWidthPercent?: number; // 탱크 대비 %
  speed?: number; // px/s
  padding?: number;
  pauseRangeMs?: [number, number];
  randomStart?: boolean;
  className?: string;
};

const EPS = 0.02;
const MIN_FLIP_INTERVAL = 500; // ms
const TRANSITION_FALLBACK_MS = 50; // transitionend 누락 대비

export default function FishSpriteTest({
  id,
  svgSource,
  label = "label",
  personaWidthPercent = 4,
  speed = 40,
  padding = 8,
  pauseRangeMs = [400, 1200],
  randomStart = true,
  className = "",
}: Props) {
  const tankRef = useContext(TankContext); // 공용 탱크
  const spriteRef = useRef<HTMLDivElement>(null); // translate 적용
  const flipRef = useRef<HTMLDivElement>(null); // scaleX 적용
  const svgHostRef = useRef<HTMLDivElement>(null);
  const labelBoxRef = useRef<HTMLSpanElement>(null);

  // id 치환 & viewBox 파싱
  const svgHtml = useMemo(() => svgSource.replaceAll(/\*\{id\}/g, id), [svgSource, id]);
  const viewBox = useMemo(() => {
    const m = svgSource.match(/viewBox\s*=\s*"([^"]+)"/i);
    if (!m) return { minX: 0, minY: 0, w: 50, h: 50 };
    const [x, y, w, h] = m[1].split(/\s+/).map(Number);
    return { minX: x, minY: y, w, h };
  }, [svgSource]);

  // 현재 탱크 픽셀 크기 (ref로만 저장: 리렌더 유발 X)
  const tankSizeRef = useRef({ w: 0, h: 0 });
  const spriteWRef = useRef(0); // 실제 렌더되는 스프라이트 폭 (2배 적용 후)
  const spriteHRef = useRef(0);
  // 캡션 크기 계산 기준 (확대 전 기준 폭)
  const labelBaseWRef = useRef(0);

  // 위치/방향 (ref로만 관리)
  const posRef = useRef({ x: 0, y: 0 });
  const facingRef = useRef<1 | -1>(1);
  const lastFlipAtRef = useRef(0);

  // SVG 주입
  useEffect(() => {
    if (svgHostRef.current) svgHostRef.current.innerHTML = svgHtml;
  }, [svgHtml]);

  // 라벨 위치 업데이트
  const updateLabel = useCallback(() => {
    const host = svgHostRef.current;
    const box = labelBoxRef.current;
    if (!host || !box) return;

    // ★ prefix 무시하고, *{id}-anchor-label-top / *{id}-anchor-center 만 본다
    // 예: spaceocto-1-*{id}-anchor-label-top, test-*{id}-anchor-label-top 모두 인식
    let anchor = host.querySelector(`[id$="${id}-anchor-label-top"]`) as SVGGraphicsElement | null;

    if (!anchor) {
      anchor = host.querySelector(`[id$="${id}-anchor-center"]`) as SVGGraphicsElement | null;
    }

    // 기본값: 정중앙 위쪽
    let ax = viewBox.w / 2;
    let ay = -2;

    if (anchor) {
      // 어떤 도형이든 bbox 기반으로 중앙/상단을 사용
      const bb = anchor.getBBox();
      ax = bb.x + bb.width / 2;
      ay = bb.y;
    }

    const px = (ax - viewBox.minX) * (spriteWRef.current / viewBox.w);
    const py = (ay - viewBox.minY) * (spriteHRef.current / viewBox.h);

    box.style.left = `${px}px`;
    box.style.top = `${py}px`;

    // 라벨 폰트 크기: 물고기 2배 확대한 뒤에도, 기존 느낌 유지
    const labelInner = box.firstElementChild as HTMLElement | null;
    if (labelInner) {
      const basisW = labelBaseWRef.current || spriteWRef.current / 2; // fallback
      labelInner.style.fontSize = `${Math.max(10, basisW * 0.22)}px`;
      labelInner.style.lineHeight = "1";
      labelInner.style.whiteSpace = "nowrap";
    }
  }, [id, viewBox]);

  // 리사이즈 옵저버: 탱크 크기, 스프라이트 픽셀 크기, 라벨 즉시 갱신
  useEffect(() => {
    const el = tankRef?.current;
    if (!el) return;

    const resize = () => {
      const r = el.getBoundingClientRect();
      tankSizeRef.current = { w: r.width, h: r.height };

      // ① 기준 폭: 기존 personaWidthPercent 기준
      const baseW = r.width * (personaWidthPercent / 100);

      // ② 물고기(도트 영역) 실제 렌더링 폭: 2배
      spriteWRef.current = baseW * 2;
      spriteHRef.current = viewBox.h * (spriteWRef.current / viewBox.w);

      // ③ 캡션 크기 계산 기준: 확대 전 폭
      labelBaseWRef.current = baseW;

      if (flipRef.current) {
        flipRef.current.style.width = `${spriteWRef.current}px`;
        flipRef.current.style.height = `${spriteHRef.current}px`;
      }
      // 라벨 좌표 재계산
      updateLabel();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    // 초기 1회 강제 계산
    resize();

    return () => ro.disconnect();
  }, [tankRef, personaWidthPercent, viewBox, updateLabel]);

  // 시작 위치
  useEffect(() => {
    const tank = tankRef?.current;
    if (!tank || !spriteRef.current) return;

    const TW = tank.clientWidth;
    const TH = tank.clientHeight;
    const W = spriteWRef.current;
    const H = spriteHRef.current;

    const minX = padding;
    const maxX = Math.max(padding, TW - padding - W);
    const minY = padding;
    const maxY = Math.max(padding, TH - padding - H);

    const sx = randomStart ? rand(minX, maxX) : minX;
    const sy = randomStart ? rand(minY, maxY) : minY;

    posRef.current = { x: sx, y: sy };
    const node = spriteRef.current;
    node.style.transition = "none";
    node.style.transform = `translate(${sx}px, ${sy}px)`;

    // 라벨은 다음 틱에
    setTimeout(updateLabel, 0);
  }, [tankRef, padding, randomStart, updateLabel]);

  // 이동 루프
  useEffect(() => {
    const tank = tankRef?.current;
    const node = spriteRef.current;
    if (!tank || !node) return;
    let cancelled = false;

    const pickTarget = () => {
      const TW = tank.clientWidth;
      const TH = tank.clientHeight;
      const W = spriteWRef.current;
      const H = spriteHRef.current;
      const minX = padding;
      const maxX = Math.max(padding, TW - padding - W);
      const minY = padding;
      const maxY = Math.max(padding, TH - padding - H);
      return { x: rand(minX, maxX), y: rand(minY, maxY) };
    };

    const applyFlip = (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastFlipAtRef.current < MIN_FLIP_INTERVAL) return;
      lastFlipAtRef.current = now;
      facingRef.current = dir;
      if (flipRef.current) {
        flipRef.current.style.transition = "none";
        flipRef.current.style.transform = `scaleX(${dir})`;
      }
      // 라벨은 뒤집힘 보정
      if (labelBoxRef.current) {
        labelBoxRef.current.style.transform = `translate(-50%, -100%) scaleX(${1 / dir})`;
      }
    };

    const waitEnd = (el: HTMLElement, durSec: number) =>
      new Promise<void>((res) => {
        let done = false;
        const h = (e: TransitionEvent) => {
          if (e.propertyName === "transform") {
            done = true;
            el.removeEventListener("transitionend", h);
            res();
          }
        };
        el.addEventListener("transitionend", h);
        // duration이 매우 짧거나 브라우저가 이벤트를 안줄 때 대비
        setTimeout(
          () => {
            if (done) return;
            el.removeEventListener("transitionend", h);
            res();
          },
          Math.max(TRANSITION_FALLBACK_MS, durSec * 1000 + 5),
        );
      });

    const run = async () => {
      while (!cancelled) {
        const t = pickTarget();
        const cur = posRef.current;
        const dx = t.x - cur.x;
        const dy = t.y - cur.y;

        const dir: 1 | -1 = dx >= EPS ? 1 : dx <= -EPS ? -1 : facingRef.current;
        if (dir !== facingRef.current) applyFlip(dir);

        const dist = Math.hypot(dx, dy);
        const dur = dist / Math.max(1, speed);

        node.style.transition = `transform ${dur}s linear`;
        node.style.transform = `translate(${t.x}px, ${t.y}px)`;
        posRef.current = { ...t };

        // 다음 틱에 라벨 좌표 재계산
        setTimeout(updateLabel, 0);

        await waitEnd(node, dur);
        await sleep(rand(pauseRangeMs[0], pauseRangeMs[1]));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [tankRef, speed, padding, pauseRangeMs, updateLabel]);

  return (
    // 자신은 공용 탱크 좌표계의 absolute node
    <div ref={spriteRef} className={`absolute will-change-transform ${className}`}>
      <div ref={flipRef} style={{ transformOrigin: "center" }}>
        <div
          ref={svgHostRef}
          style={{ width: "100%", height: "100%" }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
        {/* 라벨 컨테이너: 스프라이트 내부 절대좌표, 가운데 정렬 + 위쪽으로 */}
        <span
          ref={labelBoxRef}
          className="pointer-events-none absolute select-none"
          style={{ left: 0, top: 0, transform: "translate(-50%, -100%) scaleX(1)" }}
        >
          <span className="font-vt" style={{ whiteSpace: "nowrap" }}>
            {label}
          </span>
        </span>
      </div>
    </div>
  );
}

/* utils */
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
