<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileSelect" multiple style="display: none;" />
    <button @click="openFileDialog">Select Files</button>
    <div class="file-list">
      <div v-for="(file, index) in files" :key="file.uniqueId" class="file-item">
        <span class="file-name">{{ truncateFileName(file.name) }}</span>
        <span>{{ formatFileSize(file.size) }}</span>
        <button @click="confirmRemoveFile(file)">
         <!--  <img src="" alt="Remove" /> -->
        </button>
      </div>
    </div>
    <div class="button-container">
      <button @click="clearFiles">Cancel</button>
      <button @click="uploadFiles">Upload</button>
    </div>
    <div v-for="(progress, index) in uploadProgresses" :key="index" class="progress-container">
      <v-progress-linear :value="progress" height="20">
        <template v-slot:default>
          {{ files[index].name }} - {{ progress }}%
        </template>
      </v-progress-linear>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const files = ref([]); // 모든 파일 목록
const newFiles = ref([]); // 신규 파일 목록
const uploadProgresses = ref([]); // 업로드 진행 상태

const fileInput = ref(null);

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files);
  
  // 파일을 고유하게 식별하기 위해 uniqueId 추가
  const processedFiles = selectedFiles.map(file => ({
    ...file,
    uniqueId: `${file.name}_${file.lastModified}`
  }));

  const existingFileIds = new Set(files.value.map(file => file.uniqueId));
  const addedFiles = processedFiles.filter(file => !existingFileIds.has(file.uniqueId));
  
  if (addedFiles.length > 0) {
    newFiles.value.push(...addedFiles);
    files.value.push(...addedFiles);
    uploadProgresses.value.push(...Array(addedFiles.length).fill(0));
  }
};

const confirmRemoveFile = (file) => {
  const isNewFile = newFiles.value.some(newFile => newFile.uniqueId === file.uniqueId);
  const message = isNewFile ? 'New file' : 'Existing file';
  alert(`${message} - Deletion action will not be performed.`);
};

const openFileDialog = () => {
  fileInput.value.click();
};

const formatFileSize = (size) => {
  const kSize = size / 1024;
  return kSize.toLocaleString() + ' KB';
};

const clearFiles = () => {
  files.value = [];
  newFiles.value = [];
  uploadProgresses.value = [];
};

const uploadFiles = () => {
  // 신규 파일만 업로드
  newFiles.value.forEach((file, index) => {
    const interval = setInterval(() => {
      if (uploadProgresses.value[index] < 100) {
        uploadProgresses.value[index] = Math.min(uploadProgresses.value[index] + 10, 100);
      } else {
        clearInterval(interval);
        if (uploadProgresses.value.every(progress => progress === 100)) {
          alert('All new files uploaded successfully!');
        }
      }
    }, 3000);
  });

  // 업로드 후, 새 파일 목록 초기화
  newFiles.value = [];
};
  
const truncateFileName = (name) => {
  const maxLength = 30;
  if (name.length > maxLength) {
    return name.slice(0, maxLength) + '...';
  }
  return name;
};
</script>

<style>
.file-list {
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

.file-name {
  flex: 1;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-item button {
  margin-left: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.progress-container {
  margin-top: 10px;
}
</style>