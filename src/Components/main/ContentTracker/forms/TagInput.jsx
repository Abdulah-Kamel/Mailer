import React from 'react';
import { useField } from 'formik';
import { WithContext as ReactTags } from 'react-tag-input';
import { useTranslation } from 'react-i18next';
import './TagInput.css';

const KeyCodes = {
  enter: 13,
  tab: 9,
};

const Delimiters = [KeyCodes.enter, KeyCodes.tab];

const TagInput = ({ label, ...props }) => {
  const { t } = useTranslation();
  const [field, meta, helpers] = useField(props.name);

  const handleDelete = (i) => {
    helpers.setValue(field.value.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    helpers.setValue([...field.value, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = [...field.value];
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    helpers.setValue(newTags);
  };

  const handleClearAll = () => {
    helpers.setValue([]);
  };

  return (
    <div className="mb-3">
      <label htmlFor={props.id || props.name} className="form-label">{label}</label>
      <div className="tag-input-wrapper">
        <div className="tags-input-container">
          <ReactTags
            tags={field.value || []}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            delimiters={Delimiters}
            inputFieldPosition="top"
            autocomplete
            placeholder={t('content_tracker.form_sections.create.keywords_placeholder')}
            classNames={{
              tags: 'tags-section',
              tagInput: 'tag-input-field',
              tagInputField: 'form-control',
              selected: 'tag-container',
              tag: 'badge primary-bg text-white p-2 fw-bold fs-6 me-1 mt-1',
              remove: 'btn-close text-white ms-1',
            }}
          />
        </div>
        <button
          type="button"
          className="btn btn-outline-danger clear-all-btn"
          onClick={handleClearAll}
          disabled={!field.value || field.value.length === 0}
        >
          {t('content_tracker.form_sections.create.clear_all_button')}
        </button>
      </div>
      {meta.touched && meta.error ? (
        <div className="invalid-feedback d-block">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TagInput;
