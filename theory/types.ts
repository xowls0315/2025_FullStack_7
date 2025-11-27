// any - 아무거나 다 될 수 있음
const a1: any = [{ name: "영철" }, { age: 21 }];

// never - 절대 발생하지 않는 타입
const a2: never = (() => {
  throw new Error("에러 발생");
})();

// Function - 함수 타입
const a3: Function = () => 123;
const sum = (x: number, y: number) => x + y;

// 숫자를 넣으면 불리언으로 돌려주는 함수 정의
const a4 = (num: number): boolean => !!num;
// 숫자를 넣으면 문자화 돌려주는 함수 정의
const a5 = (num: number): string => String(num);

// unknown - 어떤 타입이 들어올지 모를 때
const a6: unknown = 21;
