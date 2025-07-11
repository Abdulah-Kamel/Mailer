import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { initialValues } from './validationSchemas';
import TaskForm from './TaskForm';

const TaskModal = ({
  show,
  onHide,
  onSubmit: onSubmitProp,
  loading,
}) => {
  const { t } = useTranslation();

  const createTaskSchema = Yup.object().shape({
    url: Yup.string().url(t('content_tracker.task_modal.validation.url_invalid')).required(t('content_tracker.task_modal.validation.url_required')),
    optional_keywords: Yup.array(),
    precise_search: Yup.boolean(),
    search_sources: Yup.string().required(t('content_tracker.task_modal.validation.search_sources_required')),
    count: Yup.number()
      .min(1, t('content_tracker.task_modal.validation.count_min'))
      .max(100, t('content_tracker.task_modal.validation.count_max'))
      .required(t('content_tracker.task_modal.validation.count_required')),
    search_time: Yup.string().required(t('content_tracker.task_modal.validation.search_time_required')),
    save_to_excel: Yup.boolean(),
    is_scheduled: Yup.boolean(),
    schedule_days: Yup.number().when('is_scheduled', {
      is: true,
      then: () => Yup.number()
        .min(1, t('content_tracker.task_modal.validation.schedule_days_min'))
        .required(t('content_tracker.task_modal.validation.schedule_days_required'))
    }),
    interval_hours: Yup.number().when('is_scheduled', {
      is: true,
      then: () => Yup.number()
        .min(1, t('content_tracker.task_modal.validation.interval_hours_min'))
        .required(t('content_tracker.task_modal.validation.interval_hours_required'))
    })
  });

  const [apiErrors, setApiErrors] = useState({});

  const handleSubmit = async (values) => {
    setApiErrors({});
    try {
      const data = { ...values };

      // Handle optional keywords
      if (data.optional_keywords && data.optional_keywords.length > 0) {
        data.optional_keywords = data.optional_keywords.map(tag => tag.text);
      } else {
        delete data.optional_keywords;
      }

      if (!data.is_scheduled) {
        delete data.schedule_days;
        delete data.interval_hours;
      }

      delete data.search_type;
      delete data.title;

      await onSubmitProp(data);
    } catch (error) {
      if (error.response?.data) {
        setApiErrors(error.response.data);
      } else {
        setApiErrors({ general: t('content_tracker.task_modal.errors.unexpected') });
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header primary-bg text-white">
              <h5 className="modal-title">
                {t('content_tracker.task_modal.create_title')}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white me-auto ms-0"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={initialValues()}
                validationSchema={createTaskSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {(formikProps) => (
                  <TaskForm
                    {...formikProps}
                    isCreateMode={true}
                    loading={loading}
                    apiErrors={apiErrors}
                    onHide={onHide}
                  />
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;

