import { CanvasSize } from "@/types/aquarium";

export default function CanvasControls({
  size, // 현재 width/height 값
  onSizeChange, // 크기 변경 시 부모에 알려주는 콜백
}: {
  size: CanvasSize;
  onSizeChange: (s: CanvasSize) => void;
}) {
  return (
    <div className="font-turret flex items-center gap-4">
      {/* WIDTH 입력 영역 */}
      <label>
        WIDTH:&nbsp;
        <input
          className="w-24 rounded border px-2 py-1"
          type="number"
          min={200}
          step={10} // 10 단위 증가,감소
          value={size.width}
          // 입력값 변경 시 onSizeChange 호출 -> 부모의 state 업데이트
          onChange={(e) =>
            onSizeChange({
              ...size, // 기존 height 값은 그대로 유지
              width: Number(e.target.value), // width만 새로운 값으로 변경
            })
          }
        />
        &nbsp;px
      </label>
      {/* HEIGHT 입력 영역 */}
      <label>
        HEIGHT:&nbsp;
        <input
          className="w-24 rounded border px-2 py-1"
          type="number"
          min={150}
          step={10} // 10 단위 증가/감소
          value={size.height}
          onChange={(e) =>
            onSizeChange({
              ...size, // 기존 width 값은 그대로 유지
              height: Number(e.target.value), // height만 새로운 값으로 변경
            })
          }
        />
        &nbsp;px
      </label>
      {/* EXPORT 버튼 - 현재는 기능 없이 콘솔 로그만 출력 */}
      {/* TODO: 클릭 시 코드 모달 띄우거나 copy 되는 기능 추가 */}
      <button
        onClick={() => console.log("EXPORT clicked")}
        className="ml-auto rounded-full bg-black px-4 py-2 text-white"
      >
        EXPORT
      </button>
    </div>
  );
}
