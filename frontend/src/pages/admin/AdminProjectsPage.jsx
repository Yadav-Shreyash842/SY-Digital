import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Eye,
  Edit,
  Trash2,
  Star,
  MoreHorizontal,
  RotateCcw,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Switch from "../../components/ui/Switch";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Dropdown from "../../components/ui/Dropdown";
import Checkbox from "../../components/ui/Checkbox";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import FileDropZone from "../../components/ui/FileDropZone";
import ImagePreviewModal from "../../components/ui/ImagePreviewModal";
import ProjectDetailsModal from "../../components/admin/ProjectDetailsModal";
import AdminListPage from "../../components/dashboard/AdminListPage";

import projectService from "../../services/project.service";
import uploadService from "../../services/upload.service";
import {
  CATEGORIES,
  STATUS_OPTIONS,
  STATUS_FILTER_OPTIONS,
  CATEGORY_FILTER_OPTIONS,
  SORT_OPTIONS,
  FEATURED_FILTER_OPTIONS,
  initialProjectForm,
  getStatusBadgeVariant,
  formatCategory,
  formatProjectDate,
  validateProjectForm,
  projectToFormValues,
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "../../utils/projectHelpers";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [form, setForm] = useState(initialProjectForm);
  const [formErrors, setFormErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [updatingProject, setUpdatingProject] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkConfirmAction, setBulkConfirmAction] = useState(null);

  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const hasActiveFilters =
    statusFilter ||
    categoryFilter ||
    featuredFilter ||
    sortFilter !== "newest" ||
    startDate ||
    endDate;

  const clearFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setFeaturedFilter("");
    setSortFilter("newest");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
        search,
        sort: sortFilter,
      };

      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (featuredFilter) params.featured = featuredFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await projectService.list(params);

      setProjects(res.data.projects);
      setPagination({
        currentPage: res.data.pagination.page,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadProjects();
  }, [page, search, statusFilter, categoryFilter, featuredFilter, sortFilter, startDate, endDate]);

  const resetForm = () => {
    setForm(initialProjectForm);
    setFormErrors({});
    setImageFile(null);
    setImagePreview("");
    setVideoFile(null);
    setVideoPreview("");
    setImageProgress(0);
    setVideoProgress(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSwitch = (value) => {
    setForm((prev) => ({ ...prev, isFeatured: value }));
  };

  const handleImageChange = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be under 5MB.");
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    try {
      setUploadingImage(true);
      setImageProgress(0);

      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadService.uploadImage(formData, (p) =>
        setImageProgress(p)
      );

      setForm((prev) => ({
        ...prev,
        images: [res.data],
      }));

      toast.success("Image uploaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Image upload failed.");
      setImageFile(null);
      setImagePreview("");
    } finally {
      setUploadingImage(false);
      setImageProgress(0);
    }
  };

  const handleVideoChange = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      return toast.error("Please select a video file.");
    }

    if (file.size > 100 * 1024 * 1024) {
      return toast.error("Video must be under 100MB.");
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));

    try {
      setUploadingVideo(true);
      setVideoProgress(0);

      const formData = new FormData();
      formData.append("video", file);

      const res = await uploadService.uploadVideo(formData, (p) =>
        setVideoProgress(p)
      );

      setForm((prev) => ({
        ...prev,
        video: res.data,
      }));

      toast.success("Video uploaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Video upload failed.");
      setVideoFile(null);
      setVideoPreview("");
    } finally {
      setUploadingVideo(false);
      setVideoProgress(0);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm((prev) => ({ ...prev, images: [] }));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    setForm((prev) => ({ ...prev, video: null }));
  };

  const buildPayload = () => {
    return {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  };

  const handleSubmit = async () => {
    const errors = validateProjectForm(form, imageFile, videoFile);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return toast.error("Please fix the errors in the form.");
    }

    if (uploadingImage || uploadingVideo) {
      return toast.error("Please wait until uploads finish.");
    }

    setCreatingProject(true);
    try {
      const payload = buildPayload();
      const res = await projectService.create(payload);
      toast.success(res.message || "Project created successfully.");
      closeCreateModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create project."
      );
    } finally {
      setCreatingProject(false);
    }
  };

  const handleUpdate = async () => {
    const errors = validateProjectForm(form, imageFile, videoFile);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return toast.error("Please fix the errors in the form.");
    }

    if (uploadingImage || uploadingVideo) {
      return toast.error("Please wait until uploads finish.");
    }

    setUpdatingProject(true);
    try {
      const payload = buildPayload();
      const res = await projectService.update(editingProject._id, payload);
      toast.success(res.message || "Project updated successfully.");
      closeEditModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update project."
      );
    } finally {
      setUpdatingProject(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await projectService.remove(deletingProject._id);
      toast.success(res.message || "Project deleted successfully.");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingProject._id);
        return next;
      });
      closeDeleteModal();
      await loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    const values = projectToFormValues(project);
    setForm(values);
    setFormErrors({});
    setImagePreview(project.images?.[0]?.url || "");
    setVideoPreview(project.video?.url || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
    resetForm();
  };

  const openViewModal = (project) => {
    setViewingProject(project);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProject(null);
  };

  const openImagePreview = (images, index = 0) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setIsImagePreviewOpen(true);
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === projects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(projects.map((p) => p._id)));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedIds.size === 0) {
      return toast.error("Please select projects first.");
    }
    setBulkConfirmAction(action);
  };

  const executeBulkAction = async () => {
    const ids = Array.from(selectedIds);
    setBulkActionLoading(true);

    try {
      if (bulkConfirmAction === "delete") {
        const res = await projectService.bulkDelete(ids);
        toast.success(res.message || `${ids.length} project(s) deleted.`);
      } else {
        const res = await projectService.bulkUpdateStatus(
          ids,
          bulkConfirmAction
        );
        toast.success(res.message || `${ids.length} project(s) updated.`);
      }

      setSelectedIds(new Set());
      setBulkConfirmAction(null);
      await loadProjects();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Bulk action failed."
      );
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async (type) => {
    let data = projects;

    if (projects.length < pagination.totalPages * 10) {
      try {
        const res = await projectService.list({
          limit: 1000,
          search,
          status: statusFilter,
          category: categoryFilter,
          featured: featuredFilter,
          sort: sortFilter,
          startDate,
          endDate,
        });
        data = res.data.projects;
      } catch {
        toast.error("Failed to fetch all projects for export.");
        return;
      }
    }

    if (data.length === 0) {
      return toast.error("No projects to export.");
    }

    try {
      switch (type) {
        case "csv":
          exportToCSV(data);
          toast.success("CSV exported successfully.");
          break;
        case "excel":
          await exportToExcel(data);
          toast.success("Excel exported successfully.");
          break;
        case "pdf":
          await exportToPDF(data);
          toast.success("PDF exported successfully.");
          break;
      }
    } catch (err) {
      console.error(err);
      toast.error("Export failed.");
    }
  };

  const selectAllChecked =
    projects.length > 0 && selectedIds.size === projects.length;

  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={selectAllChecked}
          onChange={handleSelectAll}
          theme="light"
        />
      ),
      width: "50px",
      render: (row) => (
        <Checkbox
          checked={selectedIds.has(row._id)}
          onChange={() => handleSelectOne(row._id)}
          theme="light"
        />
      ),
    },
    {
      key: "thumbnail",
      label: "",
      width: "60px",
      render: (row) => (
        <button
          onClick={() =>
            row.images?.length > 0
              ? openImagePreview(row.images, 0)
              : openViewModal(row)
          }
          className="h-10 w-10 overflow-hidden rounded-btn border border-border bg-card-bg hover:ring-2 hover:ring-primary/30 transition-all"
        >
          {row.images?.[0]?.url ? (
            <img
              src={row.images[0].url}
              alt={row.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No img
            </div>
          )}
        </button>
      ),
    },
    {
      key: "title",
      label: "Project",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-400 truncate max-w-[200px]">
            {row.shortDescription}
          </p>
        </div>
      ),
    },
    {
      key: "clientName",
      label: "Client",
      render: (row) => row.clientName || "-",
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <Badge variant="purple">{formatCategory(row.category)}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "isFeatured",
      label: "Featured",
      width: "80px",
      render: (row) =>
        row.isFeatured ? (
          <Star
            strokeWidth={1.75}
            className="h-4 w-4 fill-warning text-warning"
          />
        ) : (
          <span className="text-gray-300">-</span>
        ),
    },
    {
      key: "completionDate",
      label: "Completed",
      render: (row) => (
        <span className="text-xs text-gray-500">
          {formatProjectDate(row.completionDate)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "60px",
      render: (row) => (
        <Dropdown
          trigger={
            <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <MoreHorizontal strokeWidth={1.75} className="h-4 w-4 text-gray-500" />
            </button>
          }
          items={[
            {
              label: "View",
              icon: Eye,
              onClick: () => openViewModal(row),
            },
            {
              label: "Edit",
              icon: Edit,
              onClick: () => openEditModal(row),
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => openDeleteModal(row),
            },
          ]}
        />
      ),
    },
  ];

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const filtersUI = (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        label="Status"
        value={statusFilter}
        onChange={handleFilterChange(setStatusFilter)}
        options={STATUS_FILTER_OPTIONS}
        theme="light"
        className="w-40"
      />
      <Select
        label="Category"
        value={categoryFilter}
        onChange={handleFilterChange(setCategoryFilter)}
        options={CATEGORY_FILTER_OPTIONS}
        theme="light"
        className="w-44"
      />
      <Select
        label="Featured"
        value={featuredFilter}
        onChange={handleFilterChange(setFeaturedFilter)}
        options={FEATURED_FILTER_OPTIONS}
        theme="light"
        className="w-36"
      />
      <Select
        label="Sort"
        value={sortFilter}
        onChange={handleFilterChange(setSortFilter)}
        options={SORT_OPTIONS}
        theme="light"
        className="w-44"
      />
      <Input
        label="From"
        type="date"
        value={startDate}
        onChange={handleFilterChange(setStartDate)}
        theme="light"
        className="w-40"
      />
      <Input
        label="To"
        type="date"
        value={endDate}
        onChange={handleFilterChange(setEndDate)}
        theme="light"
        className="w-40"
      />
      {hasActiveFilters && (
        <Button
          variant="lightOutline"
          onClick={clearFilters}
          className="!h-11 !px-4 !text-sm"
        >
          <RotateCcw strokeWidth={1.75} className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );

  const toolbarUI =
    selectedIds.size > 0 ? (
      <div className="flex flex-wrap items-center gap-3 rounded-btn border border-primary/20 bg-primary/5 px-5 py-3">
        <span className="text-sm font-medium text-primary">
          {selectedIds.size} project{selectedIds.size > 1 ? "s" : ""} selected
        </span>

        <div className="h-5 w-px bg-primary/20" />

        <Button
          variant="lightOutline"
          onClick={() => handleBulkAction("published")}
          className="!h-9 !px-4 !text-xs"
          disabled={bulkActionLoading}
        >
          Publish
        </Button>
        <Button
          variant="lightOutline"
          onClick={() => handleBulkAction("archived")}
          className="!h-9 !px-4 !text-xs"
          disabled={bulkActionLoading}
        >
          Archive
        </Button>
        <Button
          variant="lightOutline"
          onClick={() => handleBulkAction("draft")}
          className="!h-9 !px-4 !text-xs"
          disabled={bulkActionLoading}
        >
          Set Draft
        </Button>

        <div className="h-5 w-px bg-primary/20" />

        <Button
          variant="danger"
          onClick={() => handleBulkAction("delete")}
          className="!h-9 !px-4 !text-xs"
          disabled={bulkActionLoading}
        >
          Delete Selected
        </Button>

        <Button
          variant="ghost"
          onClick={() => setSelectedIds(new Set())}
          className="!h-9 !px-3 !text-xs !text-gray-500"
        >
          Clear
        </Button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        <Dropdown
          trigger={
            <Button variant="lightOutline" className="!h-9 !px-4 !text-xs">
              <Download strokeWidth={1.75} className="h-3.5 w-3.5" />
              Export
            </Button>
          }
          items={[
            { label: "Export as CSV", icon: FileText, onClick: () => handleExport("csv") },
            { label: "Export as Excel", icon: FileSpreadsheet, onClick: () => handleExport("excel") },
            { label: "Export as PDF", icon: FileText, onClick: () => handleExport("pdf") },
          ]}
        />
      </div>
    );

  const renderFormModal = (isEdit) => (
    <Modal
      isOpen={isEdit ? isEditModalOpen : isCreateModalOpen}
      onClose={isEdit ? closeEditModal : closeCreateModal}
      title={isEdit ? "Edit Project" : "Create New Project"}
      size="lg"
    >
      <div className="space-y-5">
        <Input
          label="Project Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          theme="light"
          error={formErrors.title}
          maxLength={120}
        />

        <div>
          <Textarea
            label="Short Description"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            rows={3}
            theme="light"
            error={formErrors.shortDescription}
            maxLength={250}
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {form.shortDescription.length}/250
          </p>
        </div>

        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          theme="light"
          error={formErrors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Client Name"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            theme="light"
          />
          <Select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={CATEGORIES}
            theme="light"
            error={formErrors.category}
          />
        </div>

        <Input
          label="Technologies (comma separated)"
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
          theme="light"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="GitHub URL"
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleChange}
            theme="light"
            placeholder="https://github.com/..."
            error={formErrors.githubUrl}
          />
          <Input
            label="Live URL"
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
            theme="light"
            placeholder="https://..."
            error={formErrors.liveUrl}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Completion Date"
            name="completionDate"
            value={form.completionDate}
            onChange={handleChange}
            theme="light"
          />
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUS_OPTIONS}
            theme="light"
          />
        </div>

        <Switch
          label="Featured Project"
          checked={form.isFeatured}
          onChange={handleSwitch}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FileDropZone
            accept="image/*"
            label="Project Image"
            preview={imagePreview}
            uploading={uploadingImage}
            uploadProgress={imageProgress}
            onFile={handleImageChange}
            onRemove={removeImage}
            error={formErrors.image}
          />
          <FileDropZone
            accept="video/*"
            label="Project Video"
            preview={videoPreview}
            uploading={uploadingVideo}
            uploadProgress={videoProgress}
            onFile={handleVideoChange}
            onRemove={removeVideo}
            error={formErrors.video}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="lightOutline"
            onClick={isEdit ? closeEditModal : closeCreateModal}
          >
            Cancel
          </Button>
          <Button
            variant="light"
            onClick={isEdit ? handleUpdate : handleSubmit}
            disabled={
              isEdit
                ? updatingProject || uploadingImage || uploadingVideo
                : creatingProject || uploadingImage || uploadingVideo
            }
          >
            {isEdit
              ? updatingProject
                ? "Updating..."
                : "Update Project"
              : creatingProject
              ? "Creating..."
              : "Create Project"}
          </Button>
        </div>
      </div>
    </Modal>
  );

  const getBulkConfirmMessage = () => {
    const count = selectedIds.size;
    switch (bulkConfirmAction) {
      case "delete":
        return `Are you sure you want to delete ${count} project${count > 1 ? "s" : ""}? This action cannot be undone.`;
      case "published":
        return `Are you sure you want to publish ${count} project${count > 1 ? "s" : ""}?`;
      case "archived":
        return `Are you sure you want to archive ${count} project${count > 1 ? "s" : ""}?`;
      case "draft":
        return `Are you sure you want to set ${count} project${count > 1 ? "s" : ""} to draft?`;
      default:
        return "";
    }
  };

  const getBulkConfirmLabel = () => {
    switch (bulkConfirmAction) {
      case "delete":
        return "Delete All";
      case "published":
        return "Publish All";
      case "archived":
        return "Archive All";
      case "draft":
        return "Set Draft";
      default:
        return "Confirm";
    }
  };

  return (
    <>
      <AdminListPage
        title="Projects"
        description="Track and manage all client projects"
        actionLabel="New Project"
        columns={columns}
        data={projects}
        onAction={openCreateModal}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          onPageChange: setPage,
        }}
        emptyTitle="No Projects Found"
        emptyDescription="Create your first project to get started."
        filters={filtersUI}
        toolbar={toolbarUI}
        tableLoading={loading}
      />

      {renderFormModal(false)}

      {renderFormModal(true)}

      <ProjectDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProject(null);
        }}
        project={viewingProject}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
      />

      <ConfirmDialog
        isOpen={!!bulkConfirmAction}
        onClose={() => setBulkConfirmAction(null)}
        onConfirm={executeBulkAction}
        title="Bulk Action"
        message={getBulkConfirmMessage()}
        confirmLabel={getBulkConfirmLabel()}
        confirmVariant={bulkConfirmAction === "delete" ? "danger" : "light"}
        loading={bulkActionLoading}
      />

      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        images={previewImages}
        initialIndex={previewIndex}
      />
    </>
  );
}
