<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-file-input
          multiple
          show-size
          @change="handleFileSelect"
          label="Select files"
        >파일 선택</v-file-input>
      </v-col>
      <v-col cols="12">
        <v-list>
          <v-list-item
            v-for="(file, index) in files"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>{{ file.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="removeFile(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12">
        <v-btn @click="uploadFiles" :disabled="files.length === 0">Upload</v-btn>
      </v-col>
      <v-col cols="12" v-for="(progress, index) in uploadProgresses" :key="index">
        <v-progress-linear :value="progress" height="20">
          <template v-slot:default>
            {{ files[index].name }} - {{ progress }}%
          </template>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  setup() {
    const files = ref([]);
    const uploadProgresses = ref([]);
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

    const handleFileSelect = (event) => {
      files.value = Array.from(event.target.files);
      uploadProgresses.value = Array(files.value.length).fill(0);
    };

    const removeFile = (index) => {
      files.value.splice(index, 1);
      uploadProgresses.value.splice(index, 1);
    };

    const uploadFiles = async () => {
      const uploadPromises = files.value.map((file, index) => uploadFile(file, index));
      await Promise.all(uploadPromises);
      alert('All files uploaded successfully');
    };

    const uploadFile = async (file, index) => {
      const fileSize = file.size;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
      const uploadId = await initiateMultipartUpload(file.name);

      let uploadedBytes = 0;

      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        const start = chunkNumber * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunk = file.slice(start, end);

        await uploadChunk(uploadId, chunk, chunkNumber + 1, file.name);
        uploadedBytes += chunk.size;
        uploadProgresses.value[index] = Math.round((uploadedBytes / fileSize) * 100);
      }

      await completeMultipartUpload(uploadId, file.name);
    };

    const initiateMultipartUpload = async (fileName) => {
      const response = await axios.post('/upload/initiate', { fileName });
      return response.data.uploadId;
    };

    const uploadChunk = async (uploadId, chunk, partNumber, fileName) => {
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('uploadId', uploadId);
      formData.append('partNumber', partNumber);
      formData.append('fileName', fileName);

      await axios.post('/upload/part', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    };

    const completeMultipartUpload = async (uploadId, fileName) => {
      await axios.post('/upload/complete', { uploadId, fileName });
    };

    return {
      handleFileSelect,
      removeFile,
      uploadFiles,
      files,
      uploadProgresses
    };
  },
};
</script>

<style scoped>
.v-file-input {
  margin-bottom: 20px;
}
</style>