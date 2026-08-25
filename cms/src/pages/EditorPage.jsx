import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../context/AuthContext';
import { getPost, createPost, updatePost, uploadImage } from '../api/client';
import './EditorPage.css';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bannerImg, setBannerImg] = useState('');

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [error, setError] = useState('');

  const isNew = !id;

  useEffect(() => {
    if (isNew) return;

    let cancelled = false;
    async function load() {
      try {
        const res = await getPost(id, token);
        if (cancelled) return;
        setTitle(res.post.title || '');
        setContent(res.post.content || '');
        setBannerImg(res.post.bannerImg || '');
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load post');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, isNew]);

  async function handleBannerUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const res = await uploadImage(file, token);
      setBannerImg(res.url);
    } catch (err) {
      alert(err.message || 'Failed to upload banner');
    } finally {
      setUploadingBanner(false);
    }
  }

  const handleEditorImageUpload = async (blobInfo, progress) => {
    try {
      const file = blobInfo.blob();
      const res = await uploadImage(file, token, blobInfo.filename());
      return res.url;
    } catch (err) {
      return Promise.reject(err.message || 'Image upload failed');
    }
  };

  async function handleSave(publish = false) {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        title,
        content: editorRef.current ? editorRef.current.getContent() : content,
        bannerImg,
        published: publish
      };

      if (isNew) {
        await createPost(data, token);
      } else {
        await updatePost(id, data, token);
      }
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="loading-container animate-in">
      <div className="spinner"></div>
      <p>Loading editor...</p>
    </div>
  );
  if (error) return <div className="p-xl text-danger">{error}</div>;

  return (
    <div className="editor-page animate-in">
      <div className="editor-header">
        <h1>{isNew ? 'New Post' : 'Edit Post'}</h1>
        <div className="editor-actions">
          <button
            className="btn-secondary"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            className="btn-primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="editor-form">
        <input
          type="text"
          className="editor-title-input"
          placeholder="Post Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="editor-banner-section">
          <label className="editor-label">Banner Image</label>
          {bannerImg && (
            <div className="banner-preview">
              <img src={bannerImg} alt="Banner Preview" />
              <button
                type="button"
                className="btn-remove-banner"
                onClick={() => setBannerImg('')}
              >
                Remove
              </button>
            </div>
          )}
          {!bannerImg && (
            <div className="banner-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                disabled={uploadingBanner}
                id="banner-upload"
              />
              <label htmlFor="banner-upload" className="btn-secondary">
                {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
              </label>
            </div>
          )}
        </div>

        <div className="editor-content-section">
          <label className="editor-label">Content</label>
          <Editor
            key={id || 'new'}
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            onInit={(_evt, editor) => editorRef.current = editor}
            initialValue={content}
            init={{
              height: 600,
              menubar: false,
              block_formats: 'Paragraph=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Preformatted=pre',
              plugins: [
                'lists', 'link', 'image', 'codesample', 'autolink', 'charmap'
              ],
              toolbar: 'undo redo | blocks | bold italic underline strikethrough | bullist numlist outdent indent | link image | alignleft aligncenter alignright | codesample | removeformat',
              content_style: 'body { font-family:Inter,system-ui,sans-serif; font-size:16px }',
              skin: 'oxide-dark',
              content_css: 'dark',
              images_upload_handler: handleEditorImageUpload,
              automatic_uploads: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
