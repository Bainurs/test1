'use client';

import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import SectionHeading from '@/components/ui/SectionHeading';
import { CheckCircleIcon } from '@/components/icons';
import { validateName, validatePhone, validateEmail, validateRequired } from '@/utils/validation';
import type { RequestType } from '@/types';

interface FormState {
  name: string;
  phone: string;
  email: string;
  requestType: string;
}

interface FormErrors {
  name: string | null;
  phone: string | null;
  email: string | null;
  requestType: string | null;
}

const REQUEST_OPTIONS = [
  { value: 'quote', label: 'Request Quote / Service Inquiry' },
  { value: 'career', label: 'Join Our Team' },
];

const INITIAL_STATE: FormState = {
  name: '',
  phone: '',
  email: '',
  requestType: '',
};

const INITIAL_ERRORS: FormErrors = {
  name: null,
  phone: null,
  email: null,
  requestType: null,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (serverError) setServerError(null);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(form.name),
      phone: validatePhone(form.phone),
      email: validateEmail(form.email),
      requestType: validateRequired(form.requestType, 'Request type'),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          requestType: form.requestType as RequestType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Map server validation errors to form fields
        if (data.errors && Array.isArray(data.errors)) {
          const newErrors = { ...INITIAL_ERRORS };
          for (const err of data.errors) {
            if (err.field in newErrors) {
              newErrors[err.field as keyof FormErrors] = err.message;
            }
          }
          setErrors(newErrors);
        } else {
          setServerError(data.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      setForm(INITIAL_STATE);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-neutral-100 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a question or ready to start a project? Fill out the form and our team will get back to you within 24 hours."
        />

        {submitted ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl bg-white p-10 text-center shadow-soft">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Message Sent!</h3>
            <p className="mt-2 text-neutral-700">
              Thank you for reaching out. We will respond to your inquiry shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-soft sm:p-10"
            noValidate
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="John Smith"
                value={form.name}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^a-zA-ZÀ-ÿ\u0400-\u04FF\s'\-]/g, '');
                  handleChange('name', filtered);
                }}
                error={errors.name}
              />
              <PhoneInput
                label="Phone"
                value={form.phone}
                onChange={(val) => handleChange('phone', val)}
                error={errors.phone}
              />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />
              <Select
                label="Request Type"
                options={REQUEST_OPTIONS}
                placeholder="Select an option"
                value={form.requestType}
                onChange={(e) => handleChange('requestType', e.target.value)}
                error={errors.requestType}
              />
            </div>

            {serverError && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {serverError}
              </div>
            )}

            <div className="mt-8">
              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
