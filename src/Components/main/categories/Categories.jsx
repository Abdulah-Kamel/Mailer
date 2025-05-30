import React, { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import categoryService from "../../../services/categoryService";
import CategoryGrid from "./CategoryGrid";
import CategoryModal from "./CategoryModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useAuth } from "../../../Context/AuthContext";
import SearchInput from "../../common/SearchInput";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await categoryService.getAll(accessToken);

      if (data) {
        setCategories(data);
        setError(null);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [accessToken, refreshTrigger]);
  const handleSearch = async () => {
    setLoading(true);
    const { data, error } = await categoryService.search(
      accessToken,
      searchTerm
    );

    if (data) {
      setCategories(data);
      setError(null);
    } else {
      setError(error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG");
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setFormSubmitting(true);
    setFormError(null);
    try {
      let result;
      if (isEditing && selectedCategory) {
        result = await categoryService.update(
          accessToken,
          selectedCategory.id,
          values
        );
      } else {
        result = await categoryService.create(accessToken, values);
      }
      if (result.error) {
        setFormError(result.error);
        return;
      }
      resetForm();
      setShowModal(false);
      setIsEditing(false);
      setSelectedCategory(null);

      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setFormError(
        isEditing
          ? "فشل في تعديل الفئة. يرجى المحاولة مرة أخرى."
          : "فشل في إضافة الفئة. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setFormSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setFormSubmitting(true);
    setDeleteError(null);
    try {
      const result = await categoryService.delete(
        accessToken,
        selectedCategory.id
      );

      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setShowDeleteModal(false);
      setSelectedCategory(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setDeleteError("فشل في حذف الفئة. يرجى المحاولة مرة أخرى.");
    } finally {
      setFormSubmitting(false);
    }
  };
  if (loading && categories.length === 0) {
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
    <div className="px-3 mt-5 position-relative">
      <title>Data Handler - اقسام النماذج</title>
      <meta name="description" content="Data Handler - اقسام النماذج" />

      <div className="d-flex category-header justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h2>الاقسام</h2>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="ابحث عن قسم..."
          />
        </div>
        <button
          className="btn d-flex align-items-center primary-btn-outline mt-4 mt-md-0"
          onClick={() => {
            setIsEditing(false);
            setSelectedCategory(null);
            setFormError(null);
            setShowModal(true);
          }}
        >
          اضافة قسم جديد
          <i className="fas fa-plus me-2"></i>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger text-center my-4">
          {error}
          <button
            className="btn btn-sm btn-outline-danger me-3"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {categories.length === 0 && !loading ? (
        <div className="alert alert-info text-center">
          لا توجد فئات متاحة حالياً
        </div>
      ) : (
        <CategoryGrid
          categories={categories}
          loading={loading}
          formatDate={formatDate}
          onEdit={handleEdit}
          onDelete={(category) => {
            setSelectedCategory(category);
            setDeleteError(null);
            setShowDeleteModal(true);
          }}
        />
      )}

      {/* Category Modal */}
      <CategoryModal
        show={showModal}
        isEditing={isEditing}
        selectedCategory={selectedCategory}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formSubmitting={formSubmitting}
        error={formError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        category={selectedCategory}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isSubmitting={formSubmitting}
        error={deleteError}
      />

      {/* Modal backdrop */}
      {(showModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};
export default Categories;
