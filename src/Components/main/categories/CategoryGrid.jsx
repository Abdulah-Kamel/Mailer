import React from "react";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const CategoryGrid = ({ categories, loading, onEdit, onDelete }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-5">
      {loading && (
        <div
          className="position-absolute bg-light top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center w-100"
          style={{ zIndex: 1 }}
        >
          <PulseLoader color="#05755c" size={15} />
        </div>
      )}

      <div className="row g-4 justify-content-evenly">
        {categories.map((category) => (
          <div key={category.id} className="col-12 col-md-6 col-lg-4">
            <div
              className="card h-100 shadow-sm hover-shadow border-0"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="card-title fw-bold mb-0">{category.name}</h6>
                  </div>
                  <div className="badge primary-bg rounded-pill px-3 py-2 ">
                    {t("category_grid.templates_count")}:
                    <span className="fw-bold">
                      {" "}
                      {category.templates.length}
                    </span>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="d-flex gap-2 justify-content-between mt-auto">
                  <Link
                    to={`/dashboard/templates/${category.id}`}
                    className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                    style={{ flex: "1" }}
                  >
                    {t("category_grid.view_templates_button")}
                    <i className="fas fa-eye me-1"></i>
                  </Link>
                  <button
                    className="btn btn-outline-success btn-sm d-flex align-items-center"
                    onClick={() => onEdit(category)}
                    title={t("category_grid.edit_button_title")}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center"
                    onClick={() => onDelete(category)}
                    title={t("category_grid.delete_button_title")}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;