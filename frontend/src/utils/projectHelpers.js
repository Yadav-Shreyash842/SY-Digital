export const CATEGORIES = [
  { label: "Web Development", value: "web-development" },
  { label: "Mobile App", value: "mobile-app" },
  { label: "UI/UX Design", value: "ui-ux-design" },
  { label: "Digital Marketing", value: "digital-marketing" },
  { label: "Video Editing", value: "video-editing" },
  { label: "Branding", value: "branding" },
  { label: "Other", value: "other" },
];

export const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { label: "All Categories", value: "" },
  ...CATEGORIES,
];

export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Title A-Z", value: "title" },
  { label: "Recently Updated", value: "updated" },
  { label: "Recently Completed", value: "completed" },
];

export const FEATURED_FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Featured", value: "true" },
  { label: "Not Featured", value: "false" },
];

export const initialProjectForm = {
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  clientName: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  completionDate: "",
  isFeatured: false,
  status: "draft",
  images: [],
  video: null,
};

export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "blue";
    default:
      return "default";
  }
};

export const formatCategory = (category) => {
  if (!category) return "-";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatProjectDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const validateUrl = (url) => {
  if (!url || !url.trim()) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateFileSize = (file, maxMB) => {
  if (!file) return true;
  return file.size <= maxMB * 1024 * 1024;
};

export const validateProjectForm = (form, imageFile, videoFile) => {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Project title is required";
  } else if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (form.title.trim().length > 120) {
    errors.title = "Title cannot exceed 120 characters";
  }

  if (!form.shortDescription.trim()) {
    errors.shortDescription = "Short description is required";
  } else if (form.shortDescription.trim().length > 250) {
    errors.shortDescription = "Cannot exceed 250 characters";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required";
  }

  if (!form.category) {
    errors.category = "Please select a category";
  }

  if (!form.images || form.images.length === 0) {
    errors.image = "Please upload a project image";
  }

  if (form.githubUrl && !validateUrl(form.githubUrl)) {
    errors.githubUrl = "Please enter a valid URL";
  }

  if (form.liveUrl && !validateUrl(form.liveUrl)) {
    errors.liveUrl = "Please enter a valid URL";
  }

  if (imageFile && !validateFileSize(imageFile, 5)) {
    errors.image = "Image must be under 5MB";
  }

  if (videoFile && !validateFileSize(videoFile, 100)) {
    errors.video = "Video must be under 100MB";
  }

  return errors;
};

export const projectToFormValues = (project) => {
  return {
    title: project.title || "",
    shortDescription: project.shortDescription || "",
    description: project.description || "",
    category: project.category || "",
    clientName: project.clientName || "",
    technologies: Array.isArray(project.technologies)
      ? project.technologies.join(", ")
      : "",
    githubUrl: project.githubUrl || "",
    liveUrl: project.liveUrl || "",
    completionDate: project.completionDate
      ? new Date(project.completionDate).toISOString().split("T")[0]
      : "",
    isFeatured: project.isFeatured || false,
    status: project.status || "draft",
    images: project.images || [],
    video: project.video || null,
  };
};

export const exportToCSV = (data, filename = "projects") => {
  const headers = [
    "Title",
    "Client",
    "Category",
    "Status",
    "Featured",
    "Completion Date",
    "Technologies",
    "GitHub URL",
    "Live URL",
    "Created At",
  ];

  const rows = data.map((p) => [
    p.title,
    p.clientName || "",
    p.category,
    p.status,
    p.isFeatured ? "Yes" : "No",
    formatProjectDate(p.completionDate),
    Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
    p.githubUrl || "",
    p.liveUrl || "",
    formatProjectDate(p.createdAt),
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join(
      "\n"
    );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToExcel = async (data, filename = "projects") => {
  const XLSX = await import("xlsx");

  const rows = data.map((p) => ({
    Title: p.title,
    Client: p.clientName || "",
    Category: p.category,
    Status: p.status,
    Featured: p.isFeatured ? "Yes" : "No",
    "Completion Date": formatProjectDate(p.completionDate),
    Technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
    "GitHub URL": p.githubUrl || "",
    "Live URL": p.liveUrl || "",
    "Created At": formatProjectDate(p.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Projects");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = async (data, filename = "projects") => {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF("landscape");

  doc.setFontSize(18);
  doc.text("Projects Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  const headers = [
    ["Title", "Client", "Category", "Status", "Featured", "Completed", "Technologies"],
  ];

  const rows = data.map((p) => [
    p.title,
    p.clientName || "-",
    formatCategory(p.category),
    p.status,
    p.isFeatured ? "Yes" : "No",
    formatProjectDate(p.completionDate),
    Array.isArray(p.technologies) ? p.technologies.join(", ") : "-",
  ]);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 36,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [124, 58, 237] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${filename}.pdf`);
};
