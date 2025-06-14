import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PulseLoader } from "react-spinners";
import { useTemplates } from "./hooks/useTemplates";
import { useTemplateActions } from "./hooks/useTemplateActions";
import TemplateTable from "./TemplateTable";
import TemplateModal from "./TemplateModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import FileUploadModal from "./FileUploadModal";
import SearchInput from "../../common/SearchInput";

const Templates = () => {
  const { categoryId } = useParams();
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    templates,
    category,
    loading,
    error,
    refreshTrigger,
    setRefreshTrigger,
    handleSearch,
  } = useTemplates(categoryId);
  const {
    showModal,
    setShowModal,
    isEditing,
    setIsEditing,
    selectedTemplate,
    setSelectedTemplate,
    formSubmitting,
    formError,
    handleSubmit,
    handleEdit,
    showDeleteModal,
    setShowDeleteModal,
    deleteError,
    handleDelete,
    showUploadModal,
    setShowUploadModal,
    isUploading,
    uploadError,
    handleFileUpload,
    handleUploadFile,
  } = useTemplateActions(categoryId, setRefreshTrigger);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language);
  };

  if (loading && templates.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <PulseLoader color="#05755c" size={15} />
      </div>
    );
  }

  return (
    <div className="px-3">
      <title>{t("templates.page_title")}</title>
      <meta name="description" content={t("templates.page_description")} />
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start  gap-3 mb-4 mt-5 pt-5">
        <div className="d-flex  gap-3 order-2 order-lg-1">
          <div className="d-flex flex-column justify-content-center ">
            <h2 className="fs-3">
              {t("templates.main_title", { categoryName: category?.name })}
            </h2>
            <p className="text-muted fs-5">{category?.description}</p>
          </div>
        </div>
        <div className="d-flex flex-row gap-2 justify-content-end category-actions order-1 order-lg-2 mb-4 mb-md-0">
          <Link
            to="/dashboard"
            className="btn btn-outline-secondary small-text flex-grow-1 flex-md-grow-0 d-flex align-items-center"
          >
            {t("templates.back_to_categories_button")}
            <i className="fas fa-arrow-left me-2"></i>
          </Link>
          <button
            className="btn primary-btn small-text flex-grow-1 flex-md-grow-0 d-flex align-items-center"
            onClick={() => {
              setIsEditing(false);
              setSelectedTemplate(null);
              setShowModal(true);
            }}
          >
            {t("templates.add_new_button")}
            <i className="fas fa-plus me-2"></i>
          </button>
        </div>
      </div>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={() => handleSearch(searchTerm)}
        placeholder={t("templates.search_placeholder")}
        className="category-search-input "
      />
      {error && (
        <div className="alert alert-danger text-center mb-4">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            {t("templates.retry_button")}
          </button>
        </div>
      )}

      {templates.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          {t("templates.no_templates")}
        </div>
      ) : (
        <TemplateTable
          templates={templates}
          loading={loading}
          formatDate={formatDate}
          onEdit={handleEdit}
          onDelete={(template) => {
            setSelectedTemplate(template);
            setShowDeleteModal(true);
          }}
          onUploadFile={handleUploadFile}
        />
      )}

      {/* Template Modal */}
      <TemplateModal
        show={showModal}
        isEditing={isEditing}
        selectedTemplate={selectedTemplate}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formSubmitting={formSubmitting}
        error={formError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        template={selectedTemplate}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isSubmitting={formSubmitting}
        error={deleteError}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        show={showUploadModal}
        template={selectedTemplate}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        isUploading={isUploading}
        error={uploadError}
      />
      {/* Modal backdrop */}
      {(showModal || showDeleteModal || showUploadModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Templates;
