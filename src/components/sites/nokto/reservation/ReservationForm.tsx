"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { scaleVariants, slideVariants } from "../motion";
import { Section, Stack, buttonClass } from "../ui";
import { reservation, type StepNumber } from "./content";
import { ReservationProgress } from "./ReservationProgress";
import { ReservationSuccess } from "./ReservationSuccess";
import { ConfirmStep, WhenStep, WhoStep, type UpdateField } from "./steps";
import {
  hasErrors,
  initialReservation,
  validateConfirm,
  validateWhen,
  validateWho,
  type FieldErrors,
  type ReservationData,
} from "./validation";

type FormStep = StepNumber | "success";

/** Prepare a local booking summary before contacting The Hot. */
export function ReservationForm() {
  const reduce = useReducedMotion() ?? false;
  const [step, setStep] = useState<FormStep>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [data, setData] = useState<ReservationData>(initialReservation);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const updateField = useCallback<UpdateField>((field, value) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  /** Show the errors, then move focus to the first invalid control once it has rendered. */
  const reportErrors = useCallback((found: FieldErrors) => {
    setErrors((current) => ({ ...current, ...found }));
    setShowErrors(true);
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[data-error="true"], [aria-invalid="true"]')?.focus();
    });
  }, []);

  const goTo = useCallback((next: FormStep, nextDirection: 1 | -1) => {
    setErrors({});
    setShowErrors(false);
    setDirection(nextDirection);
    setStep(next);
  }, []);

  const goForward = useCallback(() => {
    if (step !== 1 && step !== 2) return;
    const found = step === 1 ? validateWhen(data) : validateWho(data);
    if (hasErrors(found)) {
      reportErrors(found);
      return;
    }
    goTo(step === 1 ? 2 : 3, 1);
  }, [data, goTo, reportErrors, step]);

  const goBack = useCallback(() => {
    if (step === 2 || step === 3) goTo(step === 2 ? 1 : 2, -1);
  }, [goTo, step]);

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (step !== 3) {
        goForward();
        return;
      }
      const found = { ...validateWhen(data), ...validateWho(data), ...validateConfirm(data) };
      if (hasErrors(found)) {
        reportErrors(found);
        return;
      }
      // Party size only: never names, phone numbers, emails or notes.
      track("reservation_complete", { party_size: data.guests });
      goTo("success", 1);
    },
    [data, goForward, goTo, reportErrors, step],
  );

  const reset = useCallback(() => {
    setData(initialReservation);
    goTo(1, -1);
  }, [goTo]);

  // After a step change, bring the form back into view if its top has scrolled above the viewport.
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const form = formRef.current;
    if (form && form.getBoundingClientRect().top < 0) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const isSuccess = step === "success";
  const visibleErrors = showErrors ? errors : {};

  return (
    <Section as="section" id="reservation-form" aria-label="Thông tin đặt bàn" relative tone="background" padY="lg">
      <div className="border-t border-border-subtle">
        <Stack gap={12} className="pt-12 lg:gap-16">
          <ReservationProgress current={isSuccess ? 3 : step} />
          <form
            ref={formRef}
            noValidate
            onSubmit={submit}
            className="flex w-full flex-col"
          >
            <div className="relative">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {isSuccess ? (
                  <motion.div key="success" variants={scaleVariants(reduce)} initial="enter" animate="center" exit="exit">
                    <ReservationSuccess data={data} onReset={reset} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants(reduce, reduce ? 0 : 24)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {step === 1 ? <WhenStep data={data} errors={visibleErrors} onUpdate={updateField} /> : null}
                    {step === 2 ? <WhoStep data={data} errors={visibleErrors} onUpdate={updateField} /> : null}
                    {step === 3 ? (
                      <ConfirmStep data={data} policyError={visibleErrors.policyAccepted} onUpdate={updateField} />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isSuccess ? null : (
              <div className="mt-12 border-t border-border-subtle pt-8">
                <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      aria-label={reservation.actions.back}
                      className={buttonClass("ghost")}
                    >
                      <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                      <span>{reservation.actions.back}</span>
                    </button>
                  ) : (
                    <span aria-hidden />
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={goForward} className={buttonClass("primary")}>
                      <span>{reservation.actions.next}</span>
                      <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={buttonClass("primary")}
                    >
                      <span>{reservation.actions.submit}</span>
                      <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </Stack>
      </div>
    </Section>
  );
}
