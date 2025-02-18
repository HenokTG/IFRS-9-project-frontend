import React, { useState } from "react";

import { Modal, Icon } from "antd";

const UploadBanner = ({ file, onFileChange }) => {
  const [hovering, setHovering] = useState(false);

  const hiddenFileInput = React.useRef(null);
  const [imageUrl, setImageUrl] = useState(file?.url);

  React.useEffect(() => {
    if (file?.url) {
      setImageUrl(file.url);
    } else if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded) {
      onFileChange(fileUploaded);
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    setPreviewImage(file?.url ?? URL.createObjectURL(file));
    setPreviewVisible(true);
    setPreviewTitle(file.name);
  };

  const handleCancel = () => setPreviewVisible(false);

  return (
    <div
      className="border border-primary rounded"
      style={{ width: "8.6rem", padding: "0.25rem" }}
    >
      <button
        type="button"
        className="btn btn-light p-0 rounded position-relative"
        onClick={() => hiddenFileInput.current.click()}
        style={{
          width: "8rem",
          height: "8rem",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {imageUrl ? (
          <div className="mx-auto">
            {hovering && (
              <div
                className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center top-0"
                style={{
                  backgroundColor: "#f3efef",
                  top: 0,
                  opacity: "0.75",
                  zIndex: 10,
                }}
              >
                <Icon
                  type="eye"
                  onClick={handlePreview}
                  className="my-icon"
                  style={{
                    color: "black",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "grey",
                  }}
                />
              </div>
            )}
            <img
              src={imageUrl}
              alt="banner"
              className="m-0"
              style={{
                height: "8rem",
              }}
            />
          </div>
        ) : (
          <div>
            <Icon type="plus" className="my-icon" />
            <div
              style={{
                marginTop: 8,
              }}
            >
              Upload
            </div>
          </div>
        )}
      </button>

      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />

      <Modal
        footer={null}
        title={previewTitle}
        onCancel={handleCancel}
        visible={previewVisible}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadBanner;
