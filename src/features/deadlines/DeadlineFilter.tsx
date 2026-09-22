import type {
    DeadlineFilter as DeadlineFilterType,
} from "./deadlineTypes";

interface DeadlineFilterProps {
    value: DeadlineFilterType;

    onChange: (
        value: DeadlineFilterType
    ) => void;
}

const options: {
    value: DeadlineFilterType;
    label: string;
}[] = [
        {
            value: "all",
            label: "Tất cả",
        },
        {
            value: "pending",
            label: "Chưa hoàn thành",
        },
        {
            value: "overdue",
            label: "Quá hạn",
        },
        {
            value: "completed",
            label: "Đã hoàn thành",
        },
    ];

export function DeadlineFilter({
    value,
    onChange,
}: DeadlineFilterProps) {
    return (
        <div
            className="deadline-filters"
            role="group"
            aria-label="Lọc bài tập"
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={
                        value === option.value
                            ? "filter-active"
                            : ""
                    }
                    aria-pressed={
                        value === option.value
                    }
                    onClick={() =>
                        onChange(option.value)
                    }
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}