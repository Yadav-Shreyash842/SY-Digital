import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Switch from "../../components/ui/Switch";
import Button from "../../components/ui/Button";

import Badge from "../../components/ui/Badge";
import AdminListPage from "../../components/dashboard/AdminListPage";
import PageLoader from "../../components/loaders/PageLoader";

import projectService from "../../services/project.service";
import uploadService from "../../services/upload.service";

const columns = [
  {
    key: "title",
    label: "Project",
  },
  {
    key: "clientName",
    label: "Client",
    render: (row) => row.clientName || "-",
  },
  {
    key: "category",
    label: "Category",
    render: (row) => row.category || "-",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        variant={
          row.status === "published"
            ? "success"
            : row.status === "draft"
            ? "warning"
            : "blue"
        }
      >
        {row.status}
      </Badge>
    ),
  },
];

const initialForm = {
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

const categoryOptions = [
  { label: "Web Development", value: "web-development" },
  { label: "Mobile App", value: "mobile-app" },
  { label: "UI/UX Design", value: "ui-ux-design" },
  { label: "Digital Marketing", value: "digital-marketing" },
  { label: "Video Editing", value: "video-editing" },
  { label: "Branding", value: "branding" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


const [form, setForm] = useState(initialForm);

const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");

const [videoFile, setVideoFile] = useState(null);
const [videoPreview, setVideoPreview] = useState("");

const [uploadingImage, setUploadingImage] = useState(false);
const [uploadingVideo, setUploadingVideo] = useState(false);

const [creatingProject, setCreatingProject] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const res = await projectService.list({
        page,
        limit: 10,
        search,
      });

      setProjects(res.data.projects);

      setPagination({
        currentPage: res.data.pagination.page,
        totalPages: res.data.pagination.totalPages,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
  setForm(initialForm);
  setIsCreateModalOpen(true);
};

const closeCreateModal = () => {
  setIsCreateModalOpen(false);

  setForm(initialForm);

  setImageFile(null);
  setImagePreview("");

  setVideoFile(null);
  setVideoPreview("");
};

const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSwitch = (value) => {
  setForm((prev) => ({
    ...prev,
    isFeatured: value,
  }));
};

const handleImageChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));

  try {
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await uploadService.uploadImage(formData);

    setForm((prev) => ({
      ...prev,
      images: [res.data],
    }));

    toast.success("Image uploaded successfully.");
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        "Image upload failed."
    );
  } finally {
    setUploadingImage(false);
  }
};

const handleVideoChange = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setVideoFile(file);
  setVideoPreview(URL.createObjectURL(file));

  try {
    setUploadingVideo(true);

    const formData = new FormData();
    formData.append("video", file);

    const res = await uploadService.uploadVideo(formData);

    setForm((prev) => ({
      ...prev,
      video: res.data,
    }));

    toast.success("Video uploaded successfully.");
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        "Video upload failed."
    );
  } finally {
    setUploadingVideo(false);
  }
};
const removeImage = () => {
  setImageFile(null);
  setImagePreview("");
};

const removeVideo = () => {
  setVideoFile(null);
  setVideoPreview("");
};

const handleSubmit = async () => {
  try {
    if (!form.title.trim()) {
      return toast.error("Project title is required.");
    }

    if (!form.shortDescription.trim()) {
      return toast.error("Short description is required.");
    }

    if (!form.description.trim()) {
      return toast.error("Description is required.");
    }

    if (!form.category) {
      return toast.error("Please select category.");
    }

    if (uploadingImage || uploadingVideo) {
      return toast.error("Please wait until uploads finish.");
    }

    setCreatingProject(true);

    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    };

  const res = await projectService.create(payload);

toast.success(res.message || "Project created successfully.");

closeCreateModal();

await loadProjects();


  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      error?.message ||
      "Unable to create project."
    );
  } finally {
    setCreatingProject(false);
  }
};













  useEffect(() => {
    loadProjects();
  }, [page, search]);

  if (loading) {
    return <PageLoader />;
  }

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
      emptyDescription="There are no projects available."
    />
    
    <Modal
  isOpen={isCreateModalOpen}
  onClose={closeCreateModal}
  title="Create New Project"
  size="lg"
>
  <div className="space-y-5">

  <Input
    label="Project Title"
    name="title"
    value={form.title}
    onChange={handleChange}
    theme="light"
  />

  <Textarea
    label="Short Description"
    name="shortDescription"
    value={form.shortDescription}
    onChange={handleChange}
    rows={3}
    theme="light"
  />

  <Textarea
    label="Description"
    name="description"
    value={form.description}
    onChange={handleChange}
    rows={5}
    theme="light"
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
      options={categoryOptions}
      theme="light"
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
    />

    <Input
      label="Live URL"
      name="liveUrl"
      value={form.liveUrl}
      onChange={handleChange}
      theme="light"
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
      options={statusOptions}
      theme="light"
    />

  </div>

  <Switch
    label="Featured Project"
    checked={form.isFeatured}
    onChange={handleSwitch}
  />



<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

  {/* Image Upload */}

  <div className="space-y-3">

    <label className="text-sm font-medium">
      Project Image
    </label>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
    />
    {uploadingImage && (
  <p className="text-sm text-blue-500 font-medium">
    Uploading image...
  </p>
)}

    {imagePreview && (
      <div className="space-y-3">

        <img
          src={imagePreview}
          alt="Preview"
          className="h-44 w-full rounded-xl object-cover border"
        />

        <Button
          variant="danger"
          onClick={removeImage}
        >
          Remove Image
        </Button>

      </div>
    )}

  </div>

  {/* Video Upload */}

  <div className="space-y-3">

    <label className="text-sm font-medium">
      Project Video
    </label>

    <input
      type="file"
      accept="video/*"
      onChange={handleVideoChange}
    />

    {uploadingVideo && (
  <p className="text-sm text-blue-500 font-medium">
    Uploading video...
  </p>
)}

    {videoPreview && (
      <div className="space-y-3">

        <video
          controls
          className="w-full rounded-xl"
        >
          <source
            src={videoPreview}
          />
        </video>

        <Button
          variant="danger"
          onClick={removeVideo}
        >
          Remove Video
        </Button>

      </div>
    )}

  </div>

</div>




  <div className="flex justify-end gap-3">

    <Button
      variant="lightOutline"
      onClick={closeCreateModal}
    >
      Cancel
    </Button>

   <Button
  variant="light"
  onClick={handleSubmit}
  disabled={
  creatingProject ||
  uploadingImage ||
  uploadingVideo
}
>
  {
  creatingProject
    ? "Creating..."
    : uploadingImage || uploadingVideo
    ? "Uploading..."
    : "Create Project"
}
</Button>

  </div>

</div>


</Modal>


    </>
    

    
  );
}