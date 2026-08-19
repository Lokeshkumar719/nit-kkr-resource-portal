import React from 'react';
import { Building2, Mail, Award, ExternalLink } from 'lucide-react';

export default function ProfileCard({ data, index, variant = 'alumni', customGradient }) {
  const isAlumni = variant === 'alumni';

  // Helper to extract direct image URL if a Google Drive sharing link is provided
  const processImageUrl = (url) => {
    if (!url) return null;
    const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const rawUrl = data.image || data.imageUrl || '';
  const processedUrl = processImageUrl(rawUrl);

  const avatarUrl =
    processedUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0f2b5b&color=fff&bold=true&size=128`;

  const bannerGradient =
    customGradient ||
    (isAlumni ? 'from-amber-500 via-orange-500 to-nit-primary' : 'from-nit-primary to-blue-600');

  const badgeText = isAlumni ? 'Alumni' : data.year;
  const badgeClass = isAlumni ? 'tag tag-amber' : 'tag';

  return (
    <div className="profile-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Banner gradient */}
      <div className={`card-banner bg-gradient-to-r ${bannerGradient}`} />

      {/* Avatar */}
      <div className="card-avatar-wrap">
        <img
          src={avatarUrl}
          alt={data.name}
          className="card-avatar"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0f2b5b&color=fff&bold=true&size=128`;
          }}
        />
      </div>

      {/* Content */}
      <div className="card-body">
        <h3 className="card-name truncate">{data.name}</h3>
        <p className="card-meta">
          {data.branch}
          <span className="mx-1.5 text-slate-300">·</span>
          <span className={badgeClass}>{badgeText}</span>
          {data.batch && (
            <>
              <span className="mx-1.5 text-slate-300">·</span>
              <span className="font-medium text-slate-600">Batch: {data.batch}</span>
            </>
          )}
        </p>

        {/* Company / Internship info */}
        {data.company && (
          <div className="card-detail">
            <Building2 />
            <span className="truncate">{data.company}</span>
          </div>
        )}

        {/* Email */}
        {data.email && (
          <div className="card-detail">
            <Mail />
            <span className="truncate">{data.email}</span>
          </div>
        )}

        {/* Skills tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="card-tags">
            {data.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag tag-blue">
                {tag}
              </span>
            ))}
            {data.tags.length > 3 && <span className="tag">+{data.tags.length - 3}</span>}
          </div>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <div className="mt-3 space-y-1">
            {data.achievements.slice(0, 2).map((ach, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                <Award className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{ach}</span>
              </div>
            ))}
          </div>
        )}

        {/* External Link */}
        {data.linkedin && (
          <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="card-link">
            <ExternalLink className="w-3.5 h-3.5" />
            {isAlumni ? 'Connect on LinkedIn' : 'View Profile'}
          </a>
        )}
      </div>
    </div>
  );
}
