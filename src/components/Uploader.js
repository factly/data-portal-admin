import React from 'react';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import GoogleDrive from '@uppy/google-drive';
import Url from '@uppy/url';
import { DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/url/dist/style.css';

import { Button } from 'antd';

const Uploader = ({ onUploadSuccess }) => {
  const [show, setShow] = React.useState(false);

  const uppy = Uppy({
    id: 'uppy-media',
    meta: { type: 'avatar' },
    allowedFileTypes: ['image/*'],
    autoProceed: false,
    onBeforeUpload: (files) => {
      const updatedFiles = {};
      Object.keys(files)
        .filter((fileId) => files[fileId].extension)
        .forEach((fileId) => {
          updatedFiles[fileId] = files[fileId];
        });
      if (Object.keys(updatedFiles).length === 0) {
        uppy.info('File must have a valid file extension');
        return false;
      }

      return updatedFiles;
    },
  })
    .use(AwsS3, { companionUrl: 'http://localhost:3020' })
    .use(Url, { companionUrl: 'http://localhost:3020' })
    .use(GoogleDrive, { companionUrl: 'http://localhost:3020' })
    .on('complete', (result) => {
      onUploadSuccess(result.successful);
    });

  return (
    <div>
      <Button onClick={() => setShow(true)}>Upload</Button>
      <DashboardModal
        uppy={uppy}
        closeModalOnClickOutside
        open={show}
        onRequestClose={() => setShow(false)}
        plugins={['GoogleDrive', 'Url']}
        metaFields={[
          { id: 'name', name: 'Name', placeholder: 'file name' },
          { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' },
        ]}
      />
    </div>
  );
};

export default Uploader;