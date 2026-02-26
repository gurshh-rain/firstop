"use client";
import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./page.module.css";

/* ── Types ────────────────────────────────────────── */
type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "In-Person" | "Hybrid";
  category: string;
  duration: string;
  paid: boolean;
  featured?: boolean;
  description: string;
  tags: string[];
  posted: string;
};

/* ── Mock Data ────────────────────────────────────── */
const INTERNSHIPS: Internship[] = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Maple Tech",
    location: "Toronto, ON",
    type: "Hybrid",
    category: "Technology",
    duration: "8 weeks",
    paid: true,
    featured: true,
    description: "Work alongside senior engineers to build real features in a production codebase. You'll write code, do code reviews, and ship real changes.",
    tags: ["React", "Node.js", "Git"],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Graphic Design Intern",
    company: "Studio North",
    location: "Vancouver, BC",
    type: "Remote",
    category: "Design",
    duration: "6 weeks",
    paid: true,
    featured: true,
    description: "Join our creative team to design marketing materials, social media assets, and brand collateral for clients across multiple industries.",
    tags: ["Figma", "Illustrator", "Branding"],
    posted: "3 days ago",
  },
  {
    id: 3,
    title: "Financial Analyst Intern",
    company: "Clearview Capital",
    location: "Calgary, AB",
    type: "In-Person",
    category: "Finance",
    duration: "10 weeks",
    paid: true,
    description: "Support our analysts with market research, data modeling, and client presentations. Exposure to real portfolios and investment decisions.",
    tags: ["Excel", "Research", "Finance"],
    posted: "1 week ago",
  },
  {
    id: 4,
    title: "Marketing Intern",
    company: "GrowthLab",
    location: "Remote",
    type: "Remote",
    category: "Marketing",
    duration: "4 weeks",
    paid: false,
    description: "Help us grow our social presence, write blog content, and run email campaigns. Perfect intro to modern digital marketing.",
    tags: ["Content", "SEO", "Email"],
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "UX Research Intern",
    company: "Forma Design",
    location: "Montreal, QC",
    type: "Hybrid",
    category: "Design",
    duration: "8 weeks",
    paid: true,
    description: "Conduct user interviews, synthesize research findings, and present insights to product teams. Shape what gets built and why.",
    tags: ["User Research", "Figma", "Notion"],
    posted: "4 days ago",
  },
  {
    id: 6,
    title: "Data Science Intern",
    company: "Quantum Analytics",
    location: "Ottawa, ON",
    type: "Remote",
    category: "Technology",
    duration: "12 weeks",
    paid: true,
    featured: true,
    description: "Work on real datasets, build ML models, and present findings to leadership. Python skills required, ML experience a bonus.",
    tags: ["Python", "Pandas", "ML"],
    posted: "1 day ago",
  },
  {
    id: 7,
    title: "Journalism Intern",
    company: "The Northern Post",
    location: "Toronto, ON",
    type: "In-Person",
    category: "Media",
    duration: "6 weeks",
    paid: false,
    description: "Report, write, and edit real stories under the mentorship of experienced journalists. Bylines are earned — including yours.",
    tags: ["Writing", "Research", "Editing"],
    posted: "1 week ago",
  },
  {
    id: 8,
    title: "Healthcare Admin Intern",
    company: "Wellpoint Clinics",
    location: "Edmonton, AB",
    type: "In-Person",
    category: "Healthcare",
    duration: "8 weeks",
    paid: true,
    description: "Learn the operations behind a modern healthcare clinic. Assist with scheduling, patient coordination, and process improvement projects.",
    tags: ["Admin", "Operations", "Healthcare"],
    posted: "3 days ago",
  },
  {
    id: 9,
    title: "Frontend Developer Intern",
    company: "Pixel Studios",
    location: "Remote",
    type: "Remote",
    category: "Technology",
    duration: "8 weeks",
    paid: true,
    description: "Build polished UI components and pages for client projects. Collaborate with designers and deliver pixel-perfect results.",
    tags: ["HTML", "CSS", "JavaScript"],
    posted: "6 days ago",
  },
  {
    id: 10,
    title: "Brand Strategy Intern",
    company: "Meridian Agency",
    location: "Vancouver, BC",
    type: "Hybrid",
    category: "Marketing",
    duration: "6 weeks",
    paid: true,
    description: "Work on brand positioning, competitive analysis, and campaign strategy for real clients. Think critically, present confidently.",
    tags: ["Strategy", "Branding", "Research"],
    posted: "2 weeks ago",
  },
  {
    id: 11,
    title: "Biotech Research Intern",
    company: "NovaBio Labs",
    location: "Toronto, ON",
    type: "In-Person",
    category: "Research",
    duration: "10 weeks",
    paid: true,
    description: "Assist with lab research in cellular biology. Gain hands-on experience with industry-grade equipment and mentorship from PhD scientists.",
    tags: ["Biology", "Lab Work", "Research"],
    posted: "4 days ago",
  },
  {
    id: 12,
    title: "Engineering Intern",
    company: "BuildCore",
    location: "Hamilton, ON",
    type: "In-Person",
    category: "Engineering",
    duration: "12 weeks",
    paid: true,
    description: "Support structural engineers on live commercial projects. Drafting, site visits, and hands-on problem solving from day one.",
    tags: ["CAD", "Drafting", "Engineering"],
    posted: "1 week ago",
  },
];

const CATEGORIES = ["All", "Technology", "Design", "Finance", "Marketing", "Media", "Healthcare", "Research", "Engineering"];
const TYPES      = ["All", "Remote", "In-Person", "Hybrid"];
const DURATIONS  = ["All", "4 weeks", "6 weeks", "8 weeks", "10 weeks", "12 weeks"];

/* ── Component ────────────────────────────────────── */
export default function SearchPage() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const [type,     setType]     = useState("All");
  const [duration, setDuration] = useState("All");
  const [paidOnly, setPaidOnly] = useState(false);
  const [selected, setSelected] = useState<Internship | null>(null);

  const results = useMemo(() => {
    return INTERNSHIPS.filter(i => {
      const q = query.toLowerCase();
      const matchQ = !q || i.title.toLowerCase().includes(q) || i.company.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q));
      const matchC = category === "All" || i.category === category;
      const matchT = type === "All" || i.type === type;
      const matchD = duration === "All" || i.duration === duration;
      const matchP = !paidOnly || i.paid;
      return matchQ && matchC && matchT && matchD && matchP;
    });
  }, [query, category, type, duration, paidOnly]);

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* ── Search Header ── */}
        <div className={styles.searchHeader}>
          <div className={styles.searchHeaderInner}>
            <h1 className={styles.searchTitle}>Find your internship.</h1>
            <div className={styles.searchBarWrap}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                className={styles.searchBar}
                type="text"
                placeholder="Search by role, company, or skill..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button className={styles.searchClear} onClick={() => setQuery("")}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.layout}>

          {/* ── Filters sidebar ── */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarShimmer} />

              <div className={styles.filterGroup}>
                <p className={styles.filterLabel}>Category</p>
                <div className={styles.filterList}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`${styles.filterBtn} ${category === c ? styles.filterActive : ""}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterDivider} />

              <div className={styles.filterGroup}>
                <p className={styles.filterLabel}>Work Type</p>
                <div className={styles.filterList}>
                  {TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`${styles.filterBtn} ${type === t ? styles.filterActive : ""}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterDivider} />

              <div className={styles.filterGroup}>
                <p className={styles.filterLabel}>Duration</p>
                <div className={styles.filterList}>
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`${styles.filterBtn} ${duration === d ? styles.filterActive : ""}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterDivider} />

              <div className={styles.filterGroup}>
                <label className={styles.toggleRow}>
                  <span className={styles.filterLabel} style={{ margin: 0 }}>Paid only</span>
                  <div
                    className={`${styles.toggle} ${paidOnly ? styles.toggleOn : ""}`}
                    onClick={() => setPaidOnly(p => !p)}
                  >
                    <div className={styles.toggleThumb} />
                  </div>
                </label>
              </div>

            </div>

            {/* Active filter count */}
            {(category !== "All" || type !== "All" || duration !== "All" || paidOnly) && (
              <button
                className={styles.clearFilters}
                onClick={() => { setCategory("All"); setType("All"); setDuration("All"); setPaidOnly(false); }}
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* ── Results ── */}
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <span className={styles.resultCount}>
                {results.length} {results.length === 1 ? "result" : "results"}
              </span>
            </div>

            {results.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>No results found.</p>
                <p className={styles.emptySub}>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {results.map(item => (
                  <div
                    key={item.id}
                    className={`${styles.card} ${selected?.id === item.id ? styles.cardActive : ""}`}
                    onClick={() => setSelected(item)}
                  >
                    <div className={styles.cardShimmer} />

                    <div className={styles.cardTop}>
                      <div className={styles.cardLogo}>
                        {item.company.charAt(0)}
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardCompany}>{item.company}</span>
                        <div className={styles.cardBadges}>
                          <span className={`${styles.badge} ${styles[`badge${item.type.replace("-","")}`]}`}>
                            {item.type}
                          </span>
                          {item.paid
                            ? <span className={`${styles.badge} ${styles.badgePaid}`}>Paid</span>
                            : <span className={styles.badge}>Unpaid</span>
                          }
                          {item.featured && (
                            <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>
                          )}
                        </div>
                      </div>
                      <span className={styles.cardPosted}>{item.posted}</span>
                    </div>

                    <h3 className={styles.cardTitle}>{item.title}</h3>

                    <div className={styles.cardDetails}>
                      <span className={styles.cardDetail}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5c0 2.75 3.5 6.5 3.5 6.5s3.5-3.75 3.5-6.5C9.5 2.567 7.933 1 6 1z" stroke="currentColor" strokeWidth="1.2"/>
                          <circle cx="6" cy="4.5" r="1" fill="currentColor"/>
                        </svg>
                        {item.location}
                      </span>
                      <span className={styles.cardDetail}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        {item.duration}
                      </span>
                      <span className={styles.cardDetail}>{item.category}</span>
                    </div>

                    <div className={styles.cardTags}>
                      {item.tags.map(t => (
                        <span key={t} className={styles.cardTag}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Detail panel ── */}
          {selected && (
            <div className={styles.detail}>
              <div className={styles.detailCard}>
                <div className={styles.detailShimmer} />

                <div className={styles.detailHeader}>
                  <div className={styles.detailLogo}>{selected.company.charAt(0)}</div>
                  <button className={styles.detailClose} onClick={() => setSelected(null)}>✕</button>
                </div>

                <h2 className={styles.detailTitle}>{selected.title}</h2>
                <p className={styles.detailCompany}>{selected.company}</p>

                <div className={styles.detailBadges}>
                  <span className={`${styles.badge} ${styles[`badge${selected.type.replace("-","")}`]}`}>
                    {selected.type}
                  </span>
                  {selected.paid
                    ? <span className={`${styles.badge} ${styles.badgePaid}`}>Paid</span>
                    : <span className={styles.badge}>Unpaid</span>
                  }
                  {selected.featured && (
                    <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>
                  )}
                </div>

                <div className={styles.detailMeta}>
                  <div className={styles.detailMetaItem}>
                    <span className={styles.detailMetaLabel}>Location</span>
                    <span className={styles.detailMetaVal}>{selected.location}</span>
                  </div>
                  <div className={styles.detailMetaItem}>
                    <span className={styles.detailMetaLabel}>Duration</span>
                    <span className={styles.detailMetaVal}>{selected.duration}</span>
                  </div>
                  <div className={styles.detailMetaItem}>
                    <span className={styles.detailMetaLabel}>Category</span>
                    <span className={styles.detailMetaVal}>{selected.category}</span>
                  </div>
                  <div className={styles.detailMetaItem}>
                    <span className={styles.detailMetaLabel}>Posted</span>
                    <span className={styles.detailMetaVal}>{selected.posted}</span>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <p className={styles.detailSectionLabel}>About the role</p>
                  <p className={styles.detailBody}>{selected.description}</p>
                </div>

                <div className={styles.detailSection}>
                  <p className={styles.detailSectionLabel}>Skills & tools</p>
                  <div className={styles.detailTags}>
                    {selected.tags.map(t => (
                      <span key={t} className={styles.cardTag}>{t}</span>
                    ))}
                  </div>
                </div>

                <a href="/signup" className={styles.applyBtn}>
                  Apply Now
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                <p className={styles.detailNote}>
                  Create a free account to apply and track your applications.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}