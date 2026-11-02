import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Check, X } from "lucide-react";

import { BASE_URL } from "@/utils/constants";
import { addUser } from "@/utils/userSlice";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MAX_SKILLS = 10;
const ABOUT_MAX = 300;
const MAX_AGE = 3;

const fieldStyle =
  "h-[50px] rounded-2xl border-base-content/15 bg-base-100/60 text-base-content placeholder:text-base-content/50 focus-visible:border-primary focus-visible:ring-primary/30";

const primaryBtn = "bg-[#ff7b5c] text-[#1a1033] hover:bg-[#ff7b5c]/90";

// Turns the user data into the shape the form edits
const toForm = (u) => ({
  firstName: u?.firstName ?? "",
  lastName: u?.lastName ?? "",
  gender: u?.gender ?? "",
  about: u?.about ?? "",
  photoUrl: u?.photoUrl ?? "",
  skills: u?.skills ?? [],
  age: u?.age != null ? String(u.age) : "",
});

const validate = (f) => {
  const errors = {};

  const first = f.firstName.trim();
  const last = f.lastName.trim();

  if (first.length < 3 || first.length > 15)
    errors.firstName = "First name must be 3 to 15 characters.";

  if (last && (last.length < 3 || last.length > 15))
    errors.lastName = "Last name must be 3 to 15 characters.";

  if (f.about.length > ABOUT_MAX)
    errors.about = `About can be at most ${ABOUT_MAX} characters.`;

   if (f.age !== "") {
     if (!/^\d+$/.test(f.age)) {
       errors.age = "Age must contain numbers only.";
     } else if (Number(f.age) < 10 || Number(f.age) > 100) {
       errors.age = "Age must be between 10 and 100.";
     }
   }

  if (f.photoUrl.trim() && !/^https?:\/\//i.test(f.photoUrl.trim()))
    errors.photoUrl = "Photo link must start with http:// or https://";

  return errors;
};

const Field = ({ label, htmlFor, hint, error, children }) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="font-semibold text-base-content">
      {label}
    </Label>

    {children}

    {error ? (
      <p className="text-sm text-error">{error}</p>
    ) : hint ? (
      <p className="text-sm text-base-content/60">{hint}</p>
    ) : null}
  </div>
);

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState(toForm(user));
  const [skillInput, setSkillInput] = useState("");
  const [showPhotoInput, setShowPhotoInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  // Keep the form in sync when the user data changes
  useEffect(() => {
    setForm(toForm(user));
  }, [user]);

  if (!user) return null;

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(form) !== JSON.stringify(toForm(user));

  const update = (key, value) => {
    setSaved(false);
    setServerError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = form.skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase(),
    );

    if (!exists && form.skills.length < MAX_SKILLS)
      update("skills", [...form.skills, skill]);

    setSkillInput("");
  };

  const removeSkill = (skill) =>
    update(
      "skills",
      form.skills.filter((s) => s !== skill),
    );

  const handleReset = () => {
    setForm(toForm(user));
    setSkillInput("");
    setSaved(false);
    setServerError("");
  };

  const handleSave = async () => {
    if (!isValid || saving) return;

    setSaving(true);
    setServerError("");

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        about: form.about.trim(),
        photoUrl: form.photoUrl.trim(),
        skills: form.skills,
      };
      //age as a number to backend rather than a string
      if (form.age !== "") {
        payload.age = Number(form.age);
      }

      // Don't send an empty gender value
      if (form.gender) {
        payload.gender = form.gender;
      }

      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });

      dispatch(addUser(res.data?.data ?? res.data));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err.response?.data;
      setServerError(typeof msg === "string" ? msg : "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  const initials =
    `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <Card className="gap-0 rounded-[28px] border-base-content/15 bg-white/60 p-0 shadow-2xl backdrop-blur-xl dark:bg-white/[0.07]">
        <CardContent className="space-y-8 p-6 pb-2 sm:p-8 sm:pb-2">
          {/* Heading */}
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-base-content">
              Edit profile
            </h1>

            <p className="mt-2 text-base-content/70">
              Keep your details up to date so developers know who they are
              matching with.
            </p>
          </div>

          {/* Photo */}
          <div className="space-y-3">
            <Label className="font-semibold text-base-content">Photo</Label>

            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={form.photoUrl}
                  alt={fullName}
                  className="object-cover"
                />

                <AvatarFallback className="bg-muted text-2xl font-extrabold text-muted-foreground">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>

              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-full px-5 font-semibold !bg-secondary hover:!bg-secondary/90 active:!bg-secondary/80 transition-colors duration-150"
                onClick={() => setShowPhotoInput((v) => !v)}
              >
                Change
              </Button>
            </div>

            {showPhotoInput && (
              <Field
                htmlFor="photoUrl"
                error={errors.photoUrl}
                hint="Paste a link to your photo."
              >
                <Input
                  id="photoUrl"
                  value={form.photoUrl}
                  onChange={(e) => update("photoUrl", e.target.value)}
                  placeholder="https://example.com/me.jpg"
                  className={fieldStyle}
                />
              </Field>
            )}
          </div>

          {/* Names */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="First name"
              htmlFor="firstName"
              error={errors.firstName}
            >
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                maxLength={15}
                className={fieldStyle}
              />
            </Field>

            <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                maxLength={15}
                className={fieldStyle}
              />
            </Field>
          </div>

          {/* About */}
          <Field
            label="About"
            htmlFor="about"
            error={errors.about}
            hint={`${form.about.length}/${ABOUT_MAX}`}
          >
            <Textarea
              id="about"
              value={form.about}
              onChange={(e) => update("about", e.target.value)}
              placeholder="Tell developers what you are building and who you want to build it with"
              rows={4}
              className="min-h-28 rounded-2xl border-base-content/15 bg-base-100/60 text-base-content placeholder:text-base-content/50 focus-visible:border-primary focus-visible:ring-primary/30"
            />
          </Field>

          {/* Age */}
          <Field
            label="Age"
            htmlFor="age"
            error={errors.age}
            hint="Enter an age between 10 and 100."
          >
            <Input
              id="age"
              type="text"
              inputMode="numeric"
              value={form.age}
              maxLength={MAX_AGE}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                update("age", value);
              }}
              placeholder="Enter your age"
              className={fieldStyle}
            />
          </Field>

          {/* Gender */}
          <Field label="Gender" htmlFor="gender">
            <Select
              value={form.gender}
              onValueChange={(v) => update("gender", v)}
            >
              <SelectTrigger id="gender" className={fieldStyle + " w-full"}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Skills */}
          <Field
            label="Skills"
            htmlFor="skills"
            hint={`Type a skill and press Enter. Up to ${MAX_SKILLS}.`}
          >
            <Input
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              onBlur={addSkill}
              placeholder="React, Node.js, MongoDB"
              disabled={form.skills.length >= MAX_SKILLS}
              className={fieldStyle}
            />

            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {form.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="gap-1 rounded-full py-1 pl-3 pr-1.5 text-sm font-semibold"
                  >
                    {skill}

                    <button
                      type="button"
                      aria-label={`Remove ${skill}`}
                      onClick={() => removeSkill(skill)}
                      style={{
                        padding: 0,
                        background: "transparent",
                        border: "none",
                        borderRadius: "9999px",
                      }}
                      className="grid h-5 w-5 shrink-0 place-items-center hover:bg-foreground/10"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </Field>

          {/* Email (read only) */}
          <Field
            label="Email"
            htmlFor="emailId"
            hint="Your email can't be changed here."
          >
            <Input
              id="emailId"
              value={user.emailId ?? ""}
              disabled
              readOnly
              className={fieldStyle + " opacity-70"}
            />
          </Field>
        </CardContent>

        {/* Bottom bar - Reset / Save */}
        <div className="sticky bottom-0 mt-4 flex flex-wrap items-center justify-end gap-3 rounded-b-[28px] border-t border-base-content/15 bg-base-100/70 px-6 py-4 backdrop-blur-xl sm:px-8">
          <div className="mr-auto text-sm" aria-live="polite">
            {serverError ? (
              <span className="text-error">{serverError}</span>
            ) : saved ? (
              <span className="inline-flex items-center gap-1.5 text-base-content">
                <Check className="h-4 w-4" /> Profile saved
              </span>
            ) : null}
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="h-12 rounded-full px-6 font-semibold
                        bg-secondary
                        hover:bg-secondary/90
                        active:bg-secondary/80
                        transition-colors duration-150"
          >
            Reset
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || !isValid || saving}
            className={"h-12 rounded-full px-7 font-extrabold " + primaryBtn}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
