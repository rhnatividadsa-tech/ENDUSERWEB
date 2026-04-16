"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import styles from "./signup-form.module.css";

type FormState = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "file", string>>>({});

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setErrors((current) => ({ ...current, file: undefined }));
  };

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.birthDate.trim()) nextErrors.birthDate = "Date of birth is required.";
    if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (!selectedFile) nextErrors.file = "Verification file is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Build multipart FormData to send to Nest.js backend
      const fd = new FormData();
      fd.append("email", form.email.trim());
      fd.append("password", form.password);

      // Split "Full Name" into first_name / last_name
      const nameParts = form.name.trim().split(/\s+/);
      fd.append("first_name", nameParts[0] || "");
      fd.append("last_name", nameParts.slice(1).join(" ") || "");

      fd.append("phone", form.phone.trim());

      // Convert mm/dd/yyyy to ISO YYYY-MM-DD for the backend DTO
      const rawDate = form.birthDate.trim();
      const dateParts = rawDate.split("/");
      const isoDob =
        dateParts.length === 3
          ? `${dateParts[2]}-${dateParts[0].padStart(2, "0")}-${dateParts[1].padStart(2, "0")}`
          : rawDate;
      fd.append("dob", isoDob);

      if (selectedFile) {
        fd.append("id_document", selectedFile);
      }

      await signup(fd);
      router.push("/signup/review");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true" />

      <section className={styles.shell}>
        <div className={styles.logoRing} aria-hidden="true" />
        <div className={styles.logoInner} aria-hidden="true">
          <Image
            src="/logos/logo.png"
            alt="BayaniHub logo"
            width={64}
            height={64}
            className={styles.logoImage}
            priority
          />
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>Sign Up &amp; Verify</h1>

          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.formColumn}>
                <label className={styles.field}>
                  <input
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                    type="email"
                    placeholder="Email Address*"
                  />
                  {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
                </label>

                <label className={styles.field}>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    type="text"
                    placeholder="Full Name*"
                  />
                  {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
                </label>

                <label className={styles.field}>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, phone: event.target.value }))
                    }
                    type="tel"
                    placeholder="Phone Number* (e.g. 9XXXXXXXXX)"
                  />
                  {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
                </label>

                <label className={styles.field}>
                  <input
                    className={`${styles.input} ${errors.birthDate ? styles.inputError : ""}`}
                    value={form.birthDate}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, birthDate: event.target.value }))
                    }
                    placeholder="Date of Birth* (mm/dd/yyyy)"
                    type="text"
                  />
                  {errors.birthDate ? (
                    <span className={styles.error}>{errors.birthDate}</span>
                  ) : null}
                </label>

                <label className={styles.field}>
                  <input
                    className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, password: event.target.value }))
                    }
                    type="password"
                    placeholder="Password*"
                  />
                  {errors.password ? <span className={styles.error}>{errors.password}</span> : null}
                </label>

                <label className={styles.field}>
                  <input
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    type="password"
                    placeholder="Confirm Password*"
                  />
                  {errors.confirmPassword ? (
                    <span className={styles.error}>{errors.confirmPassword}</span>
                  ) : null}
                </label>
              </div>

              <div className={styles.verifyColumn}>
                <div className={styles.verifyLabel}>
                  Upload Files for Verification<span className={styles.required}>*</span>
                </div>

                <div className={styles.uploadCard}>
                  <div className={styles.uploadIconWrap} aria-hidden="true">
                    <svg
                      className={styles.uploadIconSvg}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className={styles.uploadTitle}>Drop your ID here or click to browse</p>
                  <p className={styles.uploadSub}>Supported formats: JPG, PNG, PDF (Max 10MB)</p>

                  <button
                    className={styles.browseButton}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Browse Files
                  </button>

                  <input
                    ref={fileInputRef}
                    className={styles.fileInput}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />

                  {selectedFile ? <div className={styles.fileName}>{selectedFile.name}</div> : null}
                </div>

                {errors.file ? <div className={styles.banner + " " + styles.errorBanner}>{errors.file}</div> : null}
                {serverError ? (
                  <div className={styles.banner + " " + styles.errorBanner}>{serverError}</div>
                ) : null}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.submit} type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create an Account"}
              </button>

              <p className={styles.footer}>
                Already have an account? <Link href="/login">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
