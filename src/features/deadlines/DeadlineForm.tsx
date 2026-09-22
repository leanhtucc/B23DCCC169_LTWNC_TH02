import {
    useState,
    type FormEvent,
} from "react";

import type {
    CreateDeadlineInput,
    Priority,
} from "./deadlineTypes";
import { isDateString } from "../../utils/typeGuards";

interface DeadlineFormProps {
    onSubmit: (data: CreateDeadlineInput) => void;
    onCancel: () => void;
}

interface FormErrors {
    subject?: string;
    title?: string;
    dueDate?: string;
}

const initialForm: CreateDeadlineInput = {
    subject: "",
    title: "",
    dueDate: "",
    priority: "medium",
};

export function DeadlineForm({
    onSubmit,
    onCancel,
}: DeadlineFormProps) {
    const [form, setForm] =
        useState<CreateDeadlineInput>(initialForm);

    const [errors, setErrors] =
        useState<FormErrors>({});

    const handleChange = <
        K extends keyof CreateDeadlineInput
    >(
        field: K,
        value: CreateDeadlineInput[K]
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const validate = (): boolean => {
        const nextErrors: FormErrors = {};

        const subject = form.subject.trim();
        const title = form.title.trim();

        // Kiểm tra môn học
        if (!subject) {
            nextErrors.subject =
                "Vui lòng nhập tên môn học";
        } else if (subject.length > 100) {
            nextErrors.subject =
                "Tên môn học không được quá 100 ký tự";
        }

        // Kiểm tra tên bài tập
        if (!title) {
            nextErrors.title =
                "Vui lòng nhập tên bài tập";
        } else if (title.length > 200) {
            nextErrors.title =
                "Tên bài tập không được quá 200 ký tự";
        }

        // Kiểm tra hạn nộp
        if (!form.dueDate) {
            nextErrors.dueDate =
                "Vui lòng chọn hạn nộp";
        } else if (!isDateString(form.dueDate)) {
            nextErrors.dueDate =
                "Ngày không hợp lệ";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit({
            ...form,
            subject: form.subject.trim(),
            title: form.title.trim(),
        });

        setForm(initialForm);
        setErrors({});
    };

    return (
        <form
            className="deadline-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <h2>Thêm bài tập mới</h2>

            <div className="form-field">
                <label htmlFor="subject">
                    Môn học
                </label>

                <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    placeholder="Ví dụ: Lập trình Web nâng cao"
                    aria-invalid={Boolean(errors.subject)}
                    onChange={(event) =>
                        handleChange(
                            "subject",
                            event.target.value
                        )
                    }
                />

                {errors.subject && (
                    <span className="form-error">
                        {errors.subject}
                    </span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="title">
                    Tên bài tập
                </label>

                <input
                    id="title"
                    type="text"
                    value={form.title}
                    placeholder="Ví dụ: Bài thực hành 01"
                    aria-invalid={Boolean(errors.title)}
                    onChange={(event) =>
                        handleChange(
                            "title",
                            event.target.value
                        )
                    }
                />

                {errors.title && (
                    <span className="form-error">
                        {errors.title}
                    </span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="dueDate">
                    Hạn nộp
                </label>

                <input
                    id="dueDate"
                    type="date"
                    value={form.dueDate}
                    aria-invalid={Boolean(errors.dueDate)}
                    onChange={(event) =>
                        handleChange(
                            "dueDate",
                            event.target.value
                        )
                    }
                />

                {errors.dueDate && (
                    <span className="form-error">
                        {errors.dueDate}
                    </span>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="priority">
                    Độ ưu tiên
                </label>

                <select
                    id="priority"
                    value={form.priority}
                    onChange={(event) =>
                        handleChange(
                            "priority",
                            event.target.value as Priority
                        )
                    }
                >
                    <option value="low">Thấp</option>
                    <option value="medium">
                        Trung bình
                    </option>
                    <option value="high">Cao</option>
                </select>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="btn-primary"
                >
                    Thêm bài tập
                </button>
            </div>
        </form>
    );
}