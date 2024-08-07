<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileSelect" multiple style="display: none;" />
    <button @click="openFileDialog">Select Files</button>
    
    <div class="file-list">
      <div v-for="(file, index) in files" :key="file.uniqueId" class="file-item">
        <span class="file-name">{{ truncateFileName(file.name) }}</span>
        <span>{{ formatFileSize(file.size) }}</span>
        <button @click="confirmRemoveFile(file)">
          <img src="/src/assets/images/delete_icon.png" alt="Remove" style="width:16px;height:16px"/>
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
import { ref } from 'vue'
//import AWS from 'aws-sdk'

// 파일 목록 및 업로드 진행 상태 변수 설정
const files = ref([])
const newFiles = ref([])
const uploadProgresses = ref([])

const fileInput = ref(null)

// 파일 선택 핸들러
const handleFileSelect = (event) => {
  /* const selectedFiles = Array.from(event.target.files)
  const processedFiles = selectedFiles.map(file => ({
    file,
    uniqueId: `${file.name}_${file.lastModified}`
  })) */
  //const existingFileIds = new Set(files.value.map(file => file.uniqueId))
 // const addedFiles = processedFiles.filter(file => !existingFileIds.has(file.uniqueId))
  /* const addedFiles = processedFiles;
  alert(addedFiles.length);
  debugger; */

  for (let i=0; i < event.target.files.length; i++) {
    files.value.push(event.target.files[i]);
    newFiles.value.push(event.target.files[i]);
    uploadProgresses.value.push(0);
  }
}

// 파일 삭제 확인 핸들러
const confirmRemoveFile = (file) => {
  const isNewFile = newFiles.value.some(newFile => newFile.uniqueId === file.uniqueId)
  const message = isNewFile ? 'New file' : 'Existing file'
  alert(`${message} - Deletion action will not be performed.`)
}

// 파일 다이얼로그 열기
const openFileDialog = () => {
  fileInput.value.click()
}

// 파일 크기 형식화 함수
const formatFileSize = (size) => {
  const kSize = size / 1024
  return kSize.toLocaleString() + ' KB'
}

// 파일명 길이 제한 함수
const truncateFileName = (name) => {
  console.log("name L : ", name);
  const maxLength = 30;
  if (name.length > maxLength) {
    return name.slice(0, maxLength) + '...'
  }
  return name
}

// 파일 목록 초기화 함수
const clearFiles = () => {
  files.value = []
  newFiles.value = []
  uploadProgresses.value = []
}

// AWS S3 멀티파트 업로드 함수
const uploadFiles = async () => {
 /*  const s3 = new AWS.S3({
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
    region: 'your-region'
  }) 임시막음.. */
  const s3 = ({});

  for (let i = 0; i < newFiles.value.length; i++) {
    const file = newFiles.value[i]
    const uploadParams = {
      Bucket: 'your-bucket-name',
      Key: file.name,
      ContentType: file.type
    }
    const multipartUpload = s3.upload({
      ...uploadParams,
      Body: file
    }, {
      partSize: 10 * 1024 * 1024,
      queueSize: 1
    })

    multipartUpload.on('httpUploadProgress', (progress) => {
      uploadProgresses.value[i] = Math.round((progress.loaded / progress.total) * 100)
    })

    await multipartUpload.promise()
  }

  if (uploadProgresses.value.every(progress => progress === 100)) {
    alert('All new files uploaded successfully!')
  }
  
  newFiles.value = []
}
</script>

<style>
.file-list {
  max-height: 200px;
  height: 200px;
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