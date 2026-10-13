import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce Custom Hook Tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("14. Giá trị giữ nguyên trước 300ms và cập nhật chính xác sau 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 300 },
      }
    );

    // Giá trị ban đầu
    expect(result.current).toBe("initial");

    // Thay đổi prop value sang 'typing...'
    rerender({ value: "typing...", delay: 300 });

    // Trước 300ms: giá trị vẫn phải là 'initial'
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    // Khi đã qua 300ms (thêm 100ms nữa): giá trị cập nhật thành 'typing...'
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("typing...");
  });

  test("Hủy timer cũ khi giá trị thay đổi liên tục trước delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: "a" },
      }
    );

    rerender({ value: "ab" });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe("a");

    rerender({ value: "abc" });
    act(() => {
      jest.advanceTimersByTime(150);
    });
    // Vẫn chưa đủ 300ms kể từ lần đổi sang 'abc'
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(150);
    });
    // Đã đủ 300ms kể từ lần gõ 'abc'
    expect(result.current).toBe("abc");
  });
});
