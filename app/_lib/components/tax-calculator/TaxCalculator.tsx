import React, {type ChangeEvent, type JSX, useCallback, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import {
    calculateVietnamTax, formatNumber,
    normalizeNumber,
    parseFormattedNumber,
    validateNonNegative,
    validateRange,
    validateRequiredNumber
} from "./TaxUtils";
import {
    EMPTY,
    type Errors,
    type TaxFormData,
    LOWEST_PROBATION_SALARY_TO_BE_TAXED,
    MAXIMUM_BASIC_SALARY,
    MAXIMUM_PROBATION_PERCENTAGE,
    MINIMUM_BASIC_SALARY,
    MINIMUM_PROBATION_PERCENTAGE,
    type TaxCalculationResult,
    type Warnings
} from "./TaxSupport";

const inputClass = "w-full border-none outline-none bg-transparent text-xl font-['JetBrains_Mono'] text-gray-100 mb-1";
const fieldsetBase = "border rounded-lg p-3 relative focus-within:border-blue-600 transition-colors";
const legendClass = "text-[85%] text-gray-400";

const EXIT_DURATION = 450;
const ENTER_DURATION = 500;

type DisplayMode = "normal" | "probation";
type AnimState = "idle" | "exiting" | "entering";

export default function TaxCalculator(): JSX.Element {
    const [formData, setFormData] = useState<TaxFormData>({
        basicSalary: 3700000,
        grossSalary: 15500000,
        dependants: 0,
        onProbation: false,
        probationPercentage: MINIMUM_PROBATION_PERCENTAGE,
        isNewTaxPeriod: new Date().getFullYear() >= 2026,
        otherDeduction: 0,
    });
    const [errors, setErrors] = useState<Errors>({});
    const [warnings, setWarnings] = useState<Warnings>({});
    const [result, setResult] = useState<TaxCalculationResult | null>(null);
    const [hasCalculated, setHasCalculated] = useState(false);

    // Animation state machine
    const [displayMode, setDisplayMode] = useState<DisplayMode>(
        formData.onProbation ? "probation" : "normal"
    );
    const [animationState, setAnimationState] = useState<AnimState>("idle");
    const prevOnProbation = useRef(formData.onProbation);
    const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const [useVietnameseLocale, setUseVietnameseLocale] = useState(true);

    const locale = useVietnameseLocale ? "vi-VN" : undefined;

    // Formatted display values
    const [displayValues, setDisplayValues] = useState({
        basicSalary: formatNumber(3700000, locale),
        grossSalary: formatNumber(15500000, locale),
        otherDeduction: formatNumber(0, locale),
        probationPercentage: String(MINIMUM_PROBATION_PERCENTAGE)
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const {name, value, type, checked} = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({...prev, [name]: checked}));
        } else if (type === "radio") {
            setFormData((prev) => ({...prev, [name]: value === "true"}));
        } else if (name === "basicSalary" || name === "grossSalary" || name === "otherDeduction") {
            const rawValue = parseFormattedNumber(value);
            setFormData((prev) => ({...prev, [name]: rawValue}));
            setDisplayValues((prev) => ({...prev, [name]: formatNumber(rawValue, locale)}));
        } else if (name === "probationPercentage") {
            const numericValue = parseFloat(value);
            setFormData((prev) => ({...prev, [name]: numericValue}));
            setDisplayValues((prev) => ({...prev, [name]: value}));
        } else {
            setFormData((prev) => ({...prev, [name]: value}));
        }

        if (errors[name]) {
            setErrors((prev) => ({...prev, [name]: EMPTY}));
        }
        if (warnings[name]) {
            setWarnings((prev) => ({...prev, [name]: EMPTY}));
        }
    };

    const validateAndCalculate = useCallback((autoCalculate: boolean = false): boolean => {
        const newErrors: Errors = {};
        const newWarnings: Warnings = {};

        const basicSalaryError = validateRequiredNumber(formData.basicSalary, "basicSalary");

        if (basicSalaryError) {
            newErrors.basicSalary = basicSalaryError;
        } else if (!formData.onProbation) {
            const rangeValidation = validateRange(
                parseFloat(String(formData.basicSalary)),
                MINIMUM_BASIC_SALARY,
                MAXIMUM_BASIC_SALARY,
                `Lương đóng BHXH không được thấp hơn ${MINIMUM_BASIC_SALARY.toLocaleString(locale)} VNĐ`,
                `Mức lương đóng BH tối đa là ${MAXIMUM_BASIC_SALARY.toLocaleString(locale)} VNĐ`
            );
            if (rangeValidation.error) newErrors.basicSalary = rangeValidation.error;
            if (rangeValidation.warning) newWarnings.basicSalary = rangeValidation.warning;
        }

        const grossSalaryError = validateRequiredNumber(formData.grossSalary, "grossSalary");
        if (grossSalaryError) {
            newErrors.grossSalary = grossSalaryError;
        } else if (!formData.onProbation && parseFloat(String(formData.grossSalary)) < parseFloat(String(formData.basicSalary))) {
            newErrors.grossSalary = "Tổng thu nhập trước thuế phải lớn hơn lương đóng BH";
        } else if (formData.onProbation && parseFloat(String(formData.grossSalary)) < LOWEST_PROBATION_SALARY_TO_BE_TAXED) {
            newWarnings.grossSalary = `Thử việc dưới 3 tháng có mức lương thấp hơn ${LOWEST_PROBATION_SALARY_TO_BE_TAXED.toLocaleString(locale)} VNĐ không bị khấu trừ thuế`;
        }

        const dependantsError = validateNonNegative(formData.dependants);
        if (dependantsError) newErrors.dependants = "Số người phụ thuộc không được nhỏ hơn 0";

        if (formData.onProbation) {
            const probationError = validateRequiredNumber(formData.probationPercentage, "probationPercentage");
            if (probationError) {
                newErrors.probationPercentage = probationError;
            } else {
                const percentage = parseInt(String(formData.probationPercentage));
                if (percentage < MINIMUM_PROBATION_PERCENTAGE || percentage > MAXIMUM_PROBATION_PERCENTAGE) {
                    newErrors.probationPercentage = `Mức % lương thử việc là từ ${MINIMUM_PROBATION_PERCENTAGE}% đến ${MAXIMUM_PROBATION_PERCENTAGE}%`;
                }
            }
        }

        const otherDeductionError = validateNonNegative(formData.otherDeduction);
        if (otherDeductionError) newErrors.otherDeduction = otherDeductionError;

        setErrors(newErrors);
        setWarnings(newWarnings);

        const isValid = Object.keys(newErrors).length === 0;

        if (autoCalculate && isValid && hasCalculated) {
            setResult(calculateVietnamTax(
                parseFloat(String(formData.basicSalary)),
                parseFloat(String(formData.grossSalary)),
                normalizeNumber(formData.dependants, 0, parseInt),
                formData.onProbation,
                formData.onProbation
                    ? parseFloat(String(formData.probationPercentage))
                    : MAXIMUM_PROBATION_PERCENTAGE,
                formData.isNewTaxPeriod,
                normalizeNumber(formData.otherDeduction)
            ));
        } else if (autoCalculate && !isValid) {
            setResult(null);
        }

        return isValid;
    }, [formData, locale, hasCalculated]);

    // Always-current ref so the effect below doesn't re-run on every formData change
    const validateRef = useRef(validateAndCalculate);
    useEffect(() => { validateRef.current = validateAndCalculate; });

    useEffect(() => {
        const id = setTimeout(() => validateRef.current(true), 0);
        return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.onProbation, formData.isNewTaxPeriod, locale]);

    const handleBlur = (): void => { validateAndCalculate(true); };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") validateAndCalculate(true);
    };

    // Sequence: exit old fields → swap display → enter new fields
    useEffect(() => {
        if (formData.onProbation === prevOnProbation.current) return;

        prevOnProbation.current = formData.onProbation;
        animTimers.current.forEach(clearTimeout);
        animTimers.current = [];

        const t0 = setTimeout(() => setAnimationState("exiting"), 0);
        animTimers.current.push(t0);

        const t1 = setTimeout(() => {
            setDisplayMode(formData.onProbation ? "probation" : "normal");
            setAnimationState("entering");

            const t2 = setTimeout(() => setAnimationState("idle"), ENTER_DURATION);
            animTimers.current.push(t2);
        }, EXIT_DURATION);
        animTimers.current.push(t1);
    }, [formData.onProbation]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => animTimers.current.forEach(clearTimeout);
    }, []);

    // Reformat display values when locale changes
    useEffect(() => {
        const id = setTimeout(() => {
            setDisplayValues((prev) => ({
                ...prev,
                basicSalary: formatNumber(formData.basicSalary, locale),
                grossSalary: formatNumber(formData.grossSalary, locale),
                otherDeduction: formatNumber(formData.otherDeduction, locale),
            }));
        }, 0);
        return () => clearTimeout(id);
    }, [useVietnameseLocale, formData.basicSalary, formData.grossSalary, formData.otherDeduction, locale]);

    const validateForm = (): boolean => validateAndCalculate(false);

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (validateForm()) {
            setResult(calculateVietnamTax(
                parseFloat(String(formData.basicSalary)),
                parseFloat(String(formData.grossSalary)),
                normalizeNumber(formData.dependants, 0, parseInt),
                formData.onProbation,
                formData.onProbation
                    ? parseFloat(String(formData.probationPercentage))
                    : MAXIMUM_PROBATION_PERCENTAGE,
                formData.isNewTaxPeriod,
                normalizeNumber(formData.otherDeduction)
            ));
            setHasCalculated(true);
        }
    };

    const animClass = animationState === "exiting"
        ? "tax-field-exit"
        : animationState === "entering"
            ? "tax-field-enter"
            : undefined;

    return (
        <div className="w-full mx-auto p-4 mt-10 mb-10">
            <form onSubmit={handleSubmit} className="mx-auto md:w-1/2">
                <h1 className="text-3xl font-bold text-gray-100 text-center mb-6">Tính thuế TNCN</h1>
                <hr className="border-gray-800 mb-6" />
                <div className="flex flex-wrap gap-6 mb-4">
                    <label className="flex items-center gap-3 cursor-pointer text-gray-300">
                        <label className="tax-toggle-switch">
                            <input
                                type="checkbox"
                                name="onProbation"
                                checked={formData.onProbation}
                                onChange={handleInputChange}
                            />
                            <span className="tax-slider"></span>
                        </label>
                        Đang thử việc
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer text-gray-300">
                        <label className="tax-toggle-switch">
                            <input
                                type="checkbox"
                                checked={useVietnameseLocale}
                                onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) =>
                                    setUseVietnameseLocale(e.target.checked)
                                }
                            />
                            <span className="tax-slider"></span>
                        </label>
                        🇻🇳
                    </label>
                </div>

                <div className="mt-6 mb-6">
                    <fieldset className={clsx(
                        fieldsetBase,
                        errors.grossSalary ? "border-red-500" : warnings.grossSalary ? "border-yellow-500" : "border-gray-700"
                    )}>
                        <legend className={legendClass}>Tổng thu nhập trước thuế</legend>
                        <input type="text" name="grossSalary" value={displayValues.grossSalary} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className={inputClass} />
                    </fieldset>
                    {errors.grossSalary && <p className="tax-error text-red-500 text-sm mt-4">{errors.grossSalary}</p>}
                    {warnings.grossSalary && <p className="tax-warning text-yellow-500 text-sm mt-4">{warnings.grossSalary}</p>}
                </div>

                {displayMode === "normal" && (
                    <div className={clsx("overflow-hidden", animClass)}>
                        <div>
                            <fieldset className={clsx(
                                fieldsetBase,
                                errors.basicSalary ? "border-red-500" : warnings.basicSalary ? "border-yellow-500" : "border-gray-700"
                            )}>
                                <legend className={legendClass}>Mức lương đóng BH</legend>
                                <input type="text" name="basicSalary" value={displayValues.basicSalary} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className={inputClass} />
                            </fieldset>
                            {errors.basicSalary && <p className="tax-error text-red-500 text-sm mt-4">{errors.basicSalary}</p>}
                            {warnings.basicSalary && <p className="tax-warning text-yellow-500 text-sm mt-4">{warnings.basicSalary}</p>}
                        </div>

                        <div className="mt-6 mb-6">
                            <fieldset className={clsx(
                                fieldsetBase,
                                errors.otherDeduction ? "border-red-500" : "border-gray-700"
                            )}>
                                <legend className="text-[85%] text-lime-400">Phụ cấp không tính thuế</legend>
                                <input type="text" name="otherDeduction" value={displayValues.otherDeduction} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className={inputClass} />
                            </fieldset>
                            {errors.otherDeduction && <p className="tax-error text-red-500 text-sm mt-4">{errors.otherDeduction}</p>}
                        </div>

                        <div>
                            <fieldset className={clsx(
                                fieldsetBase,
                                errors.dependants ? "border-red-500" : "border-gray-700"
                            )}>
                                <legend className={legendClass}>Số người phụ thuộc</legend>
                                <input type="number" name="dependants" value={formData.dependants} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className={inputClass} />
                            </fieldset>
                            {errors.dependants && <p className="tax-error text-red-500 text-sm mt-4">{errors.dependants}</p>}
                        </div>

                        <div className="mt-4 mb-4">
                            <fieldset className={clsx(fieldsetBase, "border-gray-700")}>
                                <legend className={legendClass}>Kỳ tính thuế</legend>
                                <div className="flex flex-row gap-2 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer w-1/2 text-gray-300">
                                        <input type="radio" name="isNewTaxPeriod" value="false" checked={!formData.isNewTaxPeriod} onChange={handleInputChange} className="tax-radio" />
                                        Trước 2026
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer w-1/2 text-gray-300">
                                        <input type="radio" name="isNewTaxPeriod" value="true" checked={formData.isNewTaxPeriod} onChange={handleInputChange} className="tax-radio" />
                                        Từ 2026
                                    </label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                )}

                {displayMode === "probation" && (
                    <div className={clsx("overflow-hidden mb-4", animClass)}>
                        <fieldset className={clsx(
                            fieldsetBase,
                            errors.probationPercentage ? "border-red-500" : "border-gray-700"
                        )}>
                            <legend className={legendClass}>% mức lương cơ bản (85-100)</legend>
                            <input type="number" name="probationPercentage" value={displayValues.probationPercentage} onChange={handleInputChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className={inputClass} />
                        </fieldset>
                        {errors.probationPercentage && <p className="tax-error text-red-500 text-sm mt-4">{errors.probationPercentage}</p>}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full mt-6 mb-6 rounded bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    Tính thuế TNCN
                </button>

                {result && (
                    <details className="tax-result-details border border-gray-700 rounded-lg px-4 py-3 mt-6 mb-6 transition-[border-color,box-shadow] duration-200 hover:border-blue-500 hover:shadow-[0_0_8px_rgba(59,130,246,0.3)]" open>
                        <summary className="cursor-pointer font-semibold text-gray-300 mb-[1em]">
                            Kết quả
                        </summary>

                        <dl className="text-gray-300 [&>div]:flex [&>div]:justify-between [&>div]:py-1 [&>div+div]:mt-[0.25em]">
                            {!result.isProbation && (
                                <div>
                                    <dt>Lương đóng BH:</dt>
                                    <dd className="font-['JetBrains_Mono']">
                                        {result.cappedBaseSalary && !isNaN(result.cappedBaseSalary)
                                            ? `${Number(result.cappedBaseSalary).toLocaleString(locale)} đ`
                                            : "N/A"}
                                    </dd>
                                </div>
                            )}

                            <div>
                                <dt>Lương trước thuế:</dt>
                                <dd className="font-['JetBrains_Mono']">
                                    {result.grossSalary && !isNaN(Number(result.grossSalary))
                                        ? `${Number(result.grossSalary).toLocaleString(locale)} đ`
                                        : "N/A"}
                                </dd>
                            </div>

                            {!result.isProbation && (
                                <div>
                                    <dt>Số người phụ thuộc:</dt>
                                    <dd className="font-['JetBrains_Mono']">{Number(result.dependants).toLocaleString(locale)}</dd>
                                </div>
                            )}

                            {result.isProbation && (
                                <>
                                    <div>
                                        <dt>% mức lương thử việc:</dt>
                                        <dd className="font-['JetBrains_Mono']">{`${result.probation.probationPercentage}%`}</dd>
                                    </div>
                                    <div>
                                        <dt>Lương thử việc:</dt>
                                        <dd className="font-['JetBrains_Mono']">{`${result.probation.probationSalary.toLocaleString(locale)} đ`}</dd>
                                    </div>
                                </>
                            )}

                            <hr className="border-gray-700 my-2" />

                            {!result.isProbation && result.nonProbation && (
                                <div>
                                    <dt>Tổng đóng BH:</dt>
                                    <dd className="font-['JetBrains_Mono']">{`${result.nonProbation.insuranceAmount.toLocaleString(locale)} đ`}</dd>
                                </div>
                            )}

                            <div>
                                <dt>Thuế phải nộp:</dt>
                                <dd className="font-['JetBrains_Mono']">{`${result.taxedAmount.toLocaleString(locale)} đ`}</dd>
                            </div>

                            <div>
                                <dt>Thực lãnh:</dt>
                                <dd className="font-bold font-['JetBrains_Mono'] text-blue-500">{`${result.netSalary.toLocaleString(locale)} đ`}</dd>
                            </div>
                        </dl>
                    </details>
                )}

                <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
                    <li>
                        <a
                            href="https://www.meinvoice.vn/tin-tuc/41039/cac-khoan-thu-nhap-khong-chiu-thue-tncn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Tham khảo danh mục phụ cấp không tính thuế TNCN
                        </a>
                    </li>
                </ul>
            </form>
        </div>
    );
}
