import {
  ExternalLink,
  Code,
  Calendar,
  Clock,
  User,
  Star,
} from "lucide-react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import LazyImage from "../ui/LazyImage";
import {
  formatCategory,
  formatProjectDate,
  formatDateTime,
  getStatusBadgeVariant,
} from "../../utils/projectHelpers";

export default function ProjectDetailsModal({ isOpen, onClose, project }) {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project Details" size="xl">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={getStatusBadgeVariant(project.status)}>
            {project.status}
          </Badge>
          {project.isFeatured && (
            <Badge variant="primary">
              <Star strokeWidth={1.75} className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
          <Badge variant="default">{formatCategory(project.category)}</Badge>
        </div>

        {project.images && project.images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Images
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.images.map(
                (img, i) =>
                  img.url && (
                    <LazyImage
                      key={i}
                      src={img.url}
                      alt={`${project.title} ${i + 1}`}
                      aspectRatio="16/10"
                    />
                  )
              )}
            </div>
          </div>
        )}

        {project.video && project.video.url && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Video
            </h4>
            <video
              controls
              className="w-full rounded-card border border-border"
            >
              <source src={project.video.url} />
            </video>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Description
          </h4>
          {project.shortDescription && (
            <p className="text-sm italic text-text-secondary">
              {project.shortDescription}
            </p>
          )}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
            {project.description}
          </p>
        </div>

        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <Badge key={i} variant="primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.clientName && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Client
              </p>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <User strokeWidth={1.75} className="h-4 w-4 text-text-muted" />
                {project.clientName}
              </div>
            </div>
          )}

          {project.completionDate && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Completed
              </p>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar
                  strokeWidth={1.75}
                  className="h-4 w-4 text-text-muted"
                />
                {formatProjectDate(project.completionDate)}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Created
            </p>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock strokeWidth={1.75} className="h-4 w-4 text-text-muted" />
              {formatDateTime(project.createdAt)}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Last Updated
            </p>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock strokeWidth={1.75} className="h-4 w-4 text-text-muted" />
              {formatDateTime(project.updatedAt)}
            </div>
          </div>
        </div>

        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.githubUrl && (
              <Button
                variant="secondary"
                as="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code strokeWidth={1.75} className="h-4 w-4" />
                GitHub
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="primary"
                as="a"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink strokeWidth={1.75} className="h-4 w-4" />
                Live Demo
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
