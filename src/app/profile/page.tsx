"use client";
import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

/* ── Types ─────────────────────────────────────── */
type Experience = { id: number; role: string; company: string; start: string; end: string; current: boolean; description: string; };
type Education  = { id: number; school: string; degree: string; field: string; start: string; end: string; gpa: string; };
type Project    = { id: number; name: string; description: string; url: string; tags: string[]; };
type Award      = { id: number; title: string; issuer: string; date: string; description: string; };

/* ── Inline edit component ──────────────────────── */
function EditableText({ value, onChange, placeholder, className, multiline, tag: Tag = "p" }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  className?: string; multiline?: boolean; tag?: keyof React.JSX.IntrinsicElements;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        className={`${styles.inlineInput} ${styles.inlineTextarea} ${className ?? ""}`}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
      />
    ) : (
      <input
        autoFocus
        type="text"
        className={`${styles.inlineInput} ${className ?? ""}`}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => e.key === "Enter" && setEditing(false)}
      />
    );
  }

  return (
    // @ts-ignore
    <Tag
      className={`${styles.editable} ${className ?? ""} ${!value ? styles.editablePlaceholder : ""}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || placeholder}
    </Tag>
  );
}

/* ── Modal wrapper ──────────────────────────────── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalShimmer} />
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────── */
export default function ProfilePage() {
  /* Basic info */
  const [name,     setName]     = useState("Your Name");
  const [headline, setHeadline] = useState("Aspiring Software Engineer · High School Student");
  const [location, setLocation] = useState("Toronto, ON");
  const [about,    setAbout]    = useState("");
  const [email,    setEmail]    = useState("");
  const [website,  setWebsite]  = useState("");
  const [github,   setGithub]   = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatar,   setAvatar]   = useState("");
  const [banner,   setBanner]   = useState("");
  const [skills,   setSkills]   = useState<string[]>(["Python", "React", "Figma"]);
  const [newSkill, setNewSkill] = useState("");

  /* Sections */
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education,   setEducation]   = useState<Education[]>([]);
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [awards,      setAwards]      = useState<Award[]>([]);

  /* Modals */
  const [expModal,  setExpModal]  = useState(false);
  const [eduModal,  setEduModal]  = useState(false);
  const [projModal, setProjModal] = useState(false);
  const [awarModal, setAwarModal] = useState(false);
  const [editExp,   setEditExp]   = useState<Experience | null>(null);
  const [editEdu,   setEditEdu]   = useState<Education  | null>(null);
  const [editProj,  setEditProj]  = useState<Project    | null>(null);
  const [editAwar,  setEditAwar]  = useState<Award      | null>(null);

  /* Saved toast */
  const [saved, setSaved] = useState(false);
  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File, cb: (url: string) => void) => {
    const r = new FileReader();
    r.onload = e => cb(e.target?.result as string);
    r.readAsDataURL(file);
  };

  /* ── Skills ── */
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(""); }
  };
  const removeSkill = (s: string) => setSkills(p => p.filter(x => x !== s));

  /* ── Experience helpers ── */
  const blankExp  = (): Experience  => ({ id: Date.now(), role: "", company: "", start: "", end: "", current: false, description: "" });
  const blankEdu  = (): Education  => ({ id: Date.now(), school: "", degree: "", field: "", start: "", end: "", gpa: "" });
  const blankProj = (): Project    => ({ id: Date.now(), name: "", description: "", url: "", tags: [] });
  const blankAwar = (): Award      => ({ id: Date.now(), title: "", issuer: "", date: "", description: "" });

  const saveExp  = (e: Experience)  => { setExperiences(p => p.find(x => x.id === e.id) ? p.map(x => x.id === e.id ? e : x) : [...p, e]); setExpModal(false); setEditExp(null); showSaved(); };
  const saveEdu  = (e: Education)   => { setEducation(p  => p.find(x => x.id === e.id) ? p.map(x => x.id === e.id ? e : x) : [...p, e]); setEduModal(false); setEditEdu(null); showSaved(); };
  const saveProj = (e: Project)     => { setProjects(p   => p.find(x => x.id === e.id) ? p.map(x => x.id === e.id ? e : x) : [...p, e]); setProjModal(false); setEditProj(null); showSaved(); };
  const saveAwar = (e: Award)       => { setAwards(p     => p.find(x => x.id === e.id) ? p.map(x => x.id === e.id ? e : x) : [...p, e]); setAwarModal(false); setEditAwar(null); showSaved(); };

  const deleteExp  = (id: number) => setExperiences(p => p.filter(x => x.id !== id));
  const deleteEdu  = (id: number) => setEducation(p   => p.filter(x => x.id !== id));
  const deleteProj = (id: number) => setProjects(p    => p.filter(x => x.id !== id));
  const deleteAwar = (id: number) => setAwards(p      => p.filter(x => x.id !== id));

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* ── Banner ── */}
        <div className={styles.bannerWrap} style={banner ? { backgroundImage: `url(${banner})` } : {}}>
          <div className={styles.bannerOverlay} />
          <button className={styles.bannerEdit} onClick={() => bannerRef.current?.click()} title="Change banner">
            <CameraIcon /> Change cover
          </button>
          <input ref={bannerRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && readFile(e.target.files[0], setBanner)} />
        </div>

        {/* ── Profile card ── */}
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div className={styles.profileCardShimmer} />

            {/* Avatar */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrap} onClick={() => avatarRef.current?.click()}>
                {avatar
                  ? <img src={avatar} alt="avatar" className={styles.avatar} />
                  : <div className={styles.avatarFallback}>{name.charAt(0).toUpperCase()}</div>
                }
                <div className={styles.avatarOverlay}><CameraIcon /></div>
              </div>
              <input ref={avatarRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && readFile(e.target.files[0], setAvatar)} />
            </div>

            {/* Name & headline */}
            <div className={styles.profileInfo}>
              <EditableText value={name} onChange={setName} placeholder="Your Name" className={styles.profileName} tag="h1" />
              <EditableText value={headline} onChange={setHeadline} placeholder="Add a headline..." className={styles.profileHeadline} />
              <EditableText value={location} onChange={setLocation} placeholder="Add location..." className={styles.profileLocation} />

              {/* Social links */}
              <div className={styles.socials}>
                {[
                  { label: "Email",   val: email,   set: setEmail,   icon: <EmailIcon />,  ph: "your@email.com" },
                  { label: "Website", val: website, set: setWebsite, icon: <LinkIcon />,   ph: "yoursite.com" },
                  { label: "GitHub",  val: github,  set: setGithub,  icon: <GithubIcon />, ph: "github.com/you" },
                  { label: "LinkedIn",val: linkedin,set: setLinkedin,icon: <LinkedinIcon />,ph:"linkedin.com/in/you"},
                ].map(({ label, val, set, icon, ph }) => (
                  <EditableText key={label} value={val} onChange={set} placeholder={ph} className={styles.socialItem} tag="span" />
                ))}
              </div>
            </div>

            {/* Save button */}
            <button className={styles.saveBtn} onClick={showSaved}>Save Profile</button>
          </div>

          {/* ── Two-col layout ── */}
          <div className={styles.cols}>

            {/* Left column */}
            <div className={styles.leftCol}>

              {/* About */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>About</h2>
                </div>
                <EditableText value={about} onChange={setAbout} placeholder="Write a short bio about yourself — your interests, goals, and what makes you unique..." className={styles.aboutText} multiline tag="p" />
              </div>

              {/* Experience */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Experience</h2>
                  <button className={styles.addBtn} onClick={() => { setEditExp(blankExp()); setExpModal(true); }}>+ Add</button>
                </div>
                {experiences.length === 0 && <p className={styles.emptyHint}>Add your work experience, internships, or volunteer roles.</p>}
                <div className={styles.itemList}>
                  {experiences.map(e => (
                    <div key={e.id} className={styles.item}>
                      <div className={styles.itemIcon}>W</div>
                      <div className={styles.itemBody}>
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemTitle}>{e.role || "Role"}</span>
                          <div className={styles.itemActions}>
                            <button className={styles.itemEdit} onClick={() => { setEditExp(e); setExpModal(true); }}>Edit</button>
                            <button className={styles.itemDelete} onClick={() => deleteExp(e.id)}>✕</button>
                          </div>
                        </div>
                        <span className={styles.itemSub}>{e.company}</span>
                        <span className={styles.itemDate}>{e.start}{e.start && " – "}{e.current ? "Present" : e.end}</span>
                        {e.description && <p className={styles.itemDesc}>{e.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Education</h2>
                  <button className={styles.addBtn} onClick={() => { setEditEdu(blankEdu()); setEduModal(true); }}>+ Add</button>
                </div>
                {education.length === 0 && <p className={styles.emptyHint}>Add your schools and programs.</p>}
                <div className={styles.itemList}>
                  {education.map(e => (
                    <div key={e.id} className={styles.item}>
                      <div className={styles.itemIcon} style={{ background: "rgba(23,124,255,0.1)", borderColor: "rgba(23,124,255,0.2)", color: "rgba(23,124,255,0.8)" }}>E</div>
                      <div className={styles.itemBody}>
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemTitle}>{e.school || "School"}</span>
                          <div className={styles.itemActions}>
                            <button className={styles.itemEdit} onClick={() => { setEditEdu(e); setEduModal(true); }}>Edit</button>
                            <button className={styles.itemDelete} onClick={() => deleteEdu(e.id)}>✕</button>
                          </div>
                        </div>
                        <span className={styles.itemSub}>{[e.degree, e.field].filter(Boolean).join(", ")}</span>
                        <span className={styles.itemDate}>{e.start}{e.start && " – "}{e.end}{e.gpa && ` · GPA: ${e.gpa}`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Projects</h2>
                  <button className={styles.addBtn} onClick={() => { setEditProj(blankProj()); setProjModal(true); }}>+ Add</button>
                </div>
                {projects.length === 0 && <p className={styles.emptyHint}>Showcase the things you've built.</p>}
                <div className={styles.itemList}>
                  {projects.map(p => (
                    <div key={p.id} className={styles.item}>
                      <div className={styles.itemIcon} style={{ background: "rgba(180,100,255,0.1)", borderColor: "rgba(180,100,255,0.2)", color: "rgba(180,100,255,0.8)" }}>P</div>
                      <div className={styles.itemBody}>
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemTitle}>{p.name || "Project"}</span>
                          <div className={styles.itemActions}>
                            <button className={styles.itemEdit} onClick={() => { setEditProj(p); setProjModal(true); }}>Edit</button>
                            <button className={styles.itemDelete} onClick={() => deleteProj(p.id)}>✕</button>
                          </div>
                        </div>
                        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className={styles.projectLink}>{p.url}</a>}
                        {p.description && <p className={styles.itemDesc}>{p.description}</p>}
                        {p.tags.length > 0 && (
                          <div className={styles.tagRow}>
                            {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Awards & Honors</h2>
                  <button className={styles.addBtn} onClick={() => { setEditAwar(blankAwar()); setAwarModal(true); }}>+ Add</button>
                </div>
                {awards.length === 0 && <p className={styles.emptyHint}>Add competitions, scholarships, or recognition.</p>}
                <div className={styles.itemList}>
                  {awards.map(a => (
                    <div key={a.id} className={styles.item}>
                      <div className={styles.itemIcon} style={{ background: "rgba(255,200,80,0.1)", borderColor: "rgba(255,200,80,0.2)", color: "rgba(255,200,80,0.8)" }}>★</div>
                      <div className={styles.itemBody}>
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemTitle}>{a.title || "Award"}</span>
                          <div className={styles.itemActions}>
                            <button className={styles.itemEdit} onClick={() => { setEditAwar(a); setAwarModal(true); }}>Edit</button>
                            <button className={styles.itemDelete} onClick={() => deleteAwar(a.id)}>✕</button>
                          </div>
                        </div>
                        <span className={styles.itemSub}>{a.issuer}</span>
                        <span className={styles.itemDate}>{a.date}</span>
                        {a.description && <p className={styles.itemDesc}>{a.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right column */}
            <div className={styles.rightCol}>

              {/* Skills */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Skills</h2>
                </div>
                <div className={styles.skillsGrid}>
                  {skills.map(s => (
                    <div key={s} className={styles.skillPill}>
                      {s}
                      <button className={styles.skillRemove} onClick={() => removeSkill(s)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className={styles.skillAdd}>
                  <input
                    className={styles.skillInput}
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addSkill()}
                  />
                  <button className={styles.skillAddBtn} onClick={addSkill}>Add</button>
                </div>
              </div>

              {/* Profile strength */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Profile Strength</h2>
                </div>
                <div className={styles.strengthList}>
                  {[
                    { label: "Name & headline",  done: !!(name && headline) },
                    { label: "Profile photo",    done: !!avatar },
                    { label: "About section",    done: about.length > 20 },
                    { label: "Experience added", done: experiences.length > 0 },
                    { label: "Education added",  done: education.length > 0 },
                    { label: "Skills (3+)",      done: skills.length >= 3 },
                    { label: "Project added",    done: projects.length > 0 },
                  ].map(({ label, done }) => (
                    <div key={label} className={styles.strengthItem}>
                      <span className={`${styles.strengthDot} ${done ? styles.strengthDone : ""}`} />
                      <span className={`${styles.strengthLabel} ${done ? styles.strengthLabelDone : ""}`}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.strengthBarWrap}>
                  <div
                    className={styles.strengthBar}
                    style={{ width: `${Math.round(([!!(name && headline), !!avatar, about.length > 20, experiences.length > 0, education.length > 0, skills.length >= 3, projects.length > 0].filter(Boolean).length / 7) * 100)}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Toast ── */}
        {saved && <div className={styles.toast}>✓ Profile saved</div>}

        {/* ── Experience Modal ── */}
        {expModal && editExp && (
          <Modal title={editExp.role ? "Edit Experience" : "Add Experience"} onClose={() => { setExpModal(false); setEditExp(null); }}>
            <ExpForm value={editExp} onChange={setEditExp} onSave={saveExp} />
          </Modal>
        )}

        {/* ── Education Modal ── */}
        {eduModal && editEdu && (
          <Modal title={editEdu.school ? "Edit Education" : "Add Education"} onClose={() => { setEduModal(false); setEditEdu(null); }}>
            <EduForm value={editEdu} onChange={setEditEdu} onSave={saveEdu} />
          </Modal>
        )}

        {/* ── Project Modal ── */}
        {projModal && editProj && (
          <Modal title={editProj.name ? "Edit Project" : "Add Project"} onClose={() => { setProjModal(false); setEditProj(null); }}>
            <ProjForm value={editProj} onChange={setEditProj} onSave={saveProj} />
          </Modal>
        )}

        {/* ── Award Modal ── */}
        {awarModal && editAwar && (
          <Modal title={editAwar.title ? "Edit Award" : "Add Award"} onClose={() => { setAwarModal(false); setEditAwar(null); }}>
            <AwarForm value={editAwar} onChange={setEditAwar} onSave={saveAwar} />
          </Modal>
        )}

      </div>
      <Footer />
    </>
  );
}

/* ── Form components ──────────────────────────── */
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

function ModalInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 14px", fontSize: 14, color: "#f0f0f8", outline: "none", fontFamily: "inherit", letterSpacing: "-0.01em" }}
    />
  );
}

function ModalTextarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      rows={3}
      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 14px", fontSize: 14, color: "#f0f0f8", outline: "none", fontFamily: "inherit", resize: "vertical", letterSpacing: "-0.01em" }}
    />
  );
}

function SaveBtn({ onSave }: { onSave: () => void }) {
  return (
    <button onClick={onSave} style={{ background: "#177cff", color: "#fff", fontFamily: "inherit", fontWeight: 500, fontSize: 14, padding: "11px 28px", borderRadius: 10, cursor: "pointer", border: "none", marginTop: 4, letterSpacing: "-0.01em", transition: "background 0.2s ease" }}>
      Save
    </button>
  );
}

function ExpForm({ value, onChange, onSave }: { value: Experience; onChange: (v: Experience) => void; onSave: (v: Experience) => void; }) {
  const set = (k: keyof Experience) => (v: string | boolean) => onChange({ ...value, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <FormField label="Role / Title"><ModalInput value={value.role} onChange={set("role")} placeholder="e.g. Software Intern" /></FormField>
      <FormField label="Company"><ModalInput value={value.company} onChange={set("company")} placeholder="e.g. Maple Tech" /></FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Start Date"><ModalInput value={value.start} onChange={set("start")} placeholder="Sept 2024" /></FormField>
        <FormField label="End Date"><ModalInput value={value.end} onChange={set("end")} placeholder="Dec 2024" /></FormField>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
        <input type="checkbox" checked={value.current} onChange={e => set("current")(e.target.checked)} />
        Currently working here
      </label>
      <FormField label="Description"><ModalTextarea value={value.description} onChange={set("description")} placeholder="What did you work on?" /></FormField>
      <SaveBtn onSave={() => onSave(value)} />
    </div>
  );
}

function EduForm({ value, onChange, onSave }: { value: Education; onChange: (v: Education) => void; onSave: (v: Education) => void; }) {
  const set = (k: keyof Education) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <FormField label="School"><ModalInput value={value.school} onChange={set("school")} placeholder="e.g. Westview High School" /></FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Degree / Level"><ModalInput value={value.degree} onChange={set("degree")} placeholder="e.g. High School Diploma" /></FormField>
        <FormField label="Field of Study"><ModalInput value={value.field} onChange={set("field")} placeholder="e.g. Science & Tech" /></FormField>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <FormField label="Start"><ModalInput value={value.start} onChange={set("start")} placeholder="2022" /></FormField>
        <FormField label="End"><ModalInput value={value.end} onChange={set("end")} placeholder="2026" /></FormField>
        <FormField label="GPA"><ModalInput value={value.gpa} onChange={set("gpa")} placeholder="3.9" /></FormField>
      </div>
      <SaveBtn onSave={() => onSave(value)} />
    </div>
  );
}

function ProjForm({ value, onChange, onSave }: { value: Project; onChange: (v: Project) => void; onSave: (v: Project) => void; }) {
  const set = (k: keyof Project) => (v: string) => onChange({ ...value, [k]: v });
  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !value.tags.includes(t)) { onChange({ ...value, tags: [...value.tags, t] }); setTagInput(""); }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <FormField label="Project Name"><ModalInput value={value.name} onChange={set("name")} placeholder="e.g. Portfolio Website" /></FormField>
      <FormField label="URL"><ModalInput value={value.url} onChange={set("url")} placeholder="https://github.com/you/project" /></FormField>
      <FormField label="Description"><ModalTextarea value={value.description} onChange={set("description")} placeholder="What did you build and what did you learn?" /></FormField>
      <FormField label="Tech Stack / Tags">
        <div style={{ display: "flex", gap: 8 }}>
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="e.g. React" style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 14px", fontSize: 14, color: "#f0f0f8", outline: "none", fontFamily: "inherit" }} />
          <button onClick={addTag} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "0 14px", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Add</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          {value.tags.map(t => (
            <span key={t} style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 6 }}>
              {t}
              <button onClick={() => onChange({ ...value, tags: value.tags.filter(x => x !== t) })} style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, lineHeight: 1 }}>✕</button>
            </span>
          ))}
        </div>
      </FormField>
      <SaveBtn onSave={() => onSave(value)} />
    </div>
  );
}

function AwarForm({ value, onChange, onSave }: { value: Award; onChange: (v: Award) => void; onSave: (v: Award) => void; }) {
  const set = (k: keyof Award) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <FormField label="Award Title"><ModalInput value={value.title} onChange={set("title")} placeholder="e.g. Regional Science Fair — 1st Place" /></FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Issuer"><ModalInput value={value.issuer} onChange={set("issuer")} placeholder="e.g. Ontario Science Centre" /></FormField>
        <FormField label="Date"><ModalInput value={value.date} onChange={set("date")} placeholder="May 2024" /></FormField>
      </div>
      <FormField label="Description"><ModalTextarea value={value.description} onChange={set("description")} placeholder="Describe the award or what you achieved." /></FormField>
      <SaveBtn onSave={() => onSave(value)} />
    </div>
  );
}

/* ── Icons ──────────────────────────────────────── */
const CameraIcon    = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 4l1-2h4l1 2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
const EmailIcon     = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4l5 3 5-3" stroke="currentColor" strokeWidth="1.2"/></svg>;
const LinkIcon      = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 7a2.5 2.5 0 0 0 3.536.036l1.5-1.5A2.5 2.5 0 0 0 6.5 2L5.75 2.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5a2.5 2.5 0 0 0-3.536-.036l-1.5 1.5A2.5 2.5 0 0 0 5.5 10l.75-.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const GithubIcon    = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const LinkedinIcon  = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>;