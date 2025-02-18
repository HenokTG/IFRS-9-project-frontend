import { useState, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

// @mui
import { Dialog, DialogContent, DialogTitle, Stack, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';

// components
import Iconify from '../Iconify';

// ----------------------------------------------------------------------

const UploadContainerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'grab',
}));

const UploadTextStyle = styled('div')(({ theme }) => ({
  fontSize: '1.25rem',
  marginTop: 8,
  color: '#048eff',
}));

const UploadedImageStyle = styled('img')(({ theme }) => ({
  height: '7rem',
  width: '7rem',
  borderRadius: '8px',
}));

const HoverDropShadowStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: -0.25,
  zIndex: 10,
  opacity: '0.75',
  position: 'absolute',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  cursor: 'grab',
  backgroundColor: '#232737',
}));

const ImageUploadFieldContainerStyle = styled('div')(({ theme }) => ({
  width: '7.4rem',
  height: '7.4rem',
  overflow: 'hidden',
  borderRadius: '8px',
  padding: 2,
  position: 'relative',
  border: '1px solid #048eff',
}));

const previewIconStyle = {
  width: 40,
  height: 40,
  color: '#f08c2d',
  border: '2px solid #f08c2d',
  borderRadius: '8px',
  cursor: 'pointer',
  p: '4px',
};

// ----------------------------------------------------------------------

const ImageField = ({ currentImage, onImageChange }) => {
  const [hovering, setHovering] = useState(false);

  const [imageInfo, setImageInfo] = useState(null);
  const [imageUrl, setImageUrl] = useState(currentImage?.url);

  useEffect(() => {
    if (currentImage?.url) {
      setImageUrl(currentImage.url);
      setImageInfo(currentImage);
    }
  }, [currentImage]);

  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      setImageInfo(acceptedFiles[0]);
    },
  });

  const handlePreview = (e) => {
    e?.stopPropagation();
    setPreviewTitle(imageInfo.name);
    setPreviewImage(imageInfo?.url ?? URL.createObjectURL(imageInfo));
    setPreviewVisible(true);
  };

  const isImage = () => imageInfo?.type?.split('/')[0] === 'image';

  useEffect(() => {
    if (isImage()) {
      handlePreview();
    }
  }, [imageInfo]);

  const handleCancel = () => {
    setImageInfo(currentImage);
    setImageUrl(currentImage?.url);
    setPreviewVisible(false);
  };

  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleSubmit = () => {
    setIsSubmiting(true);
    onImageChange(imageInfo)
      .then(() => {
        setIsSubmiting(false);
        handleCancel();
      })
      .catch(() => {
        setIsSubmiting(false);
      });
  };

  return (
    <>
      <ImageUploadFieldContainerStyle
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        {...getRootProps({ className: 'dropzone' })}
      >
        <input {...getInputProps()} />
        {imageUrl ? (
          <Stack>
            {hovering && (
              <HoverDropShadowStyle>
                <Iconify onClick={handlePreview} icon="fontisto:eye" sx={previewIconStyle} />
              </HoverDropShadowStyle>
            )}
            <UploadedImageStyle src={imageUrl} alt={imageInfo.name} />
          </Stack>
        ) : (
          <UploadContainerStyle>
            <Iconify icon="icomoon-free:plus" sx={{ mr: 0.5, width: 30, height: 30, color: '#048eff' }} />
            <UploadTextStyle>Upload</UploadTextStyle>
          </UploadContainerStyle>
        )}
      </ImageUploadFieldContainerStyle>

      <Dialog open={previewVisible} onClose={handleCancel}>
        <DialogTitle>{previewTitle}</DialogTitle>
        <DialogContent>
          <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
          <Stack>
            <img alt={previewTitle} style={{ maxHeight: 250 }} src={previewImage} />
          </Stack>
          {isImage() && (
            <>
              <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
              <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
                <Button variant="outlined" color="error" onClick={handleCancel}>
                  Cancel
                </Button>
                <LoadingButton fullWidth type="submit" variant="contained" onClick={handleSubmit} loading={isSubmiting}>
                  Change
                </LoadingButton>
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageField;
