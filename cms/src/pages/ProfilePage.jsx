import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuthorProfile, updateAuthorProfile } from '../api/client';
import './ProfilePage.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    bio: '',
    tagline: '',
    githubUrl: '',
    linkedinUrl: '',
    projectLinks: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getAuthorProfile();
        if (cancelled) return;
        setProfile({
          bio: res.bio || '',
          tagline: res.tagline || '',
          githubUrl: res.githubUrl || '',
          linkedinUrl: res.linkedinUrl || '',
          projectLinks: res.projectLinks || []
        });
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleFieldChange(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }));
  }

  function handleProjectChange(index, field, value) {
    const newProjects = [...profile.projectLinks];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProfile(prev => ({ ...prev, projectLinks: newProjects }));
  }

  function addProject() {
    setProfile(prev => ({
      ...prev,
      projectLinks: [...prev.projectLinks, { name: '', url: '', description: '' }]
    }));
  }

  function removeProject(index) {
    const newProjects = profile.projectLinks.filter((_, i) => i !== index);
    setProfile(prev => ({ ...prev, projectLinks: newProjects }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAuthorProfile(profile, token);
      alert('Profile updated successfully');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="loading-container animate-in">
      <div className="spinner"></div>
      <p>Loading profile...</p>
    </div>
  );
  if (error) return <div className="p-xl text-danger">{error}</div>;

  return (
    <div className="profile-page animate-in">
      <div className="dashboard-header">
        <h1>Author Profile</h1>
        <button 
          className="btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="profile-card">
          <h2 className="profile-card__title">Basic Info</h2>
          
          <div className="form-group">
            <label>Tagline</label>
            <input 
              type="text" 
              value={profile.tagline}
              onChange={e => handleFieldChange('tagline', e.target.value)}
              placeholder="e.g. Full-stack engineer building with Node.js and React"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea 
              rows="4"
              value={profile.bio}
              onChange={e => handleFieldChange('bio', e.target.value)}
              placeholder="Detailed bio..."
            />
          </div>
        </div>

        <div className="profile-card">
          <h2 className="profile-card__title">Social Links</h2>
          
          <div className="form-group">
            <label>GitHub URL</label>
            <input 
              type="url" 
              value={profile.githubUrl}
              onChange={e => handleFieldChange('githubUrl', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label>LinkedIn URL</label>
            <input 
              type="url" 
              value={profile.linkedinUrl}
              onChange={e => handleFieldChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card__header">
            <h2 className="profile-card__title">Project Links</h2>
            <button type="button" className="btn-secondary" onClick={addProject}>
              + Add Project
            </button>
          </div>

          {profile.projectLinks.length === 0 ? (
            <p className="text-muted text-sm">No projects added yet.</p>
          ) : (
            <div className="project-list">
              {profile.projectLinks.map((project, idx) => (
                <div key={idx} className="project-item">
                  <div className="project-item__header">
                    <h3>Project #{idx + 1}</h3>
                    <button 
                      type="button" 
                      className="btn-action text-danger" 
                      onClick={() => removeProject(idx)}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Name</label>
                      <input 
                        type="text" 
                        value={project.name}
                        onChange={e => handleProjectChange(idx, 'name', e.target.value)}
                        placeholder="Project Name"
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>URL</label>
                      <input 
                        type="url" 
                        value={project.url}
                        onChange={e => handleProjectChange(idx, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <input 
                      type="text" 
                      value={project.description}
                      onChange={e => handleProjectChange(idx, 'description', e.target.value)}
                      placeholder="Brief description (e.g. Express + Prisma + React)"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
