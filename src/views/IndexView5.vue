<template>
    <div>
      <input type="file" multiple @change="handleFileSelect" />
      <button @click="uploadFiles">Upload</button>
      <div v-for="(progress, index) in uploadProgresses" :key="index">
        File {{ index + 1 }} Progress: {{ progress }}%
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import AWS from 'aws-sdk';
  
  export default {
    setup() {
      const files = ref([]);
      const uploadProgresses = ref([]);
  
      // S3 설정
      AWS.config.update({
        accessKeyId: 'YOUR_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
        region: 'YOUR_AWS_REGION',
      });
  
      const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
      });
  
      const handleFileSelect = (event) => {
        files.value = Array.from(event.target.files);
        uploadProgresses.value = Array(files.value.length).fill(0);
      };
  
      const uploadFile = async (file, index) => {
        const createMultipartUpload = async () => {
          const params = {
            Bucket: 'YOUR_BUCKET_NAME',
            Key: file.name,
          };
          return s3.createMultipartUpload(params).promise();
        };
  
        const uploadPart = async (uploadId, partNumber, partData) => {
          const params = {
            Bucket: 'YOUR_BUCKET_NAME',
            Key: file.name,
            PartNumber: partNumber,
            UploadId: uploadId,
            Body: partData,
          };
          return s3.uploadPart(params).promise();
        };
  
        const completeMultipartUpload = async (uploadId, parts) => {
          const params = {
            Bucket: 'YOUR_BUCKET_NAME',
            Key: file.name,
            MultipartUpload: {
              Parts: parts,
            },
            UploadId: uploadId,
          };
          return s3.completeMultipartUpload(params).promise();
        };
  
        try {
          // 멀티파트 업로드 시작
          const multipart = await createMultipartUpload();
          const uploadId = multipart.UploadId;
  
          const chunkSize = 5 * 1024 * 1024; // 5MB
          const parts = [];
  
          // 파일을 나누어 각 파트를 업로드
          for (let start = 0; start < file.size; start += chunkSize) {
            const end = Math.min(start + chunkSize, file.size);
            const partNumber = parts.length + 1;
            const partData = file.slice(start, end);
  
            const part = await uploadPart(uploadId, partNumber, partData);
            parts.push({ ETag: part.ETag, PartNumber: partNumber });
  
            // 업로드 진행 상황 업데이트
            uploadProgresses.value[index] = Math.round((end / file.size) * 100);
          }
  
          // 멀티파트 업로드 완료
          await completeMultipartUpload(uploadId, parts);
          alert(`File ${file.name} uploaded successfully!`);
        } catch (error) {
          console.error(`Upload failed for ${file.name}:`, error);
          alert(`Upload failed for ${file.name}`);
        }
      };
  
      const uploadFiles = async () => {
        const uploadPromises = files.value.map((file, index) => uploadFile(file, index));
        await Promise.all(uploadPromises);
      };
  
      return {
        handleFileSelect,
        uploadFiles,
        uploadProgresses,
      };
    },
  };
  </script>
  