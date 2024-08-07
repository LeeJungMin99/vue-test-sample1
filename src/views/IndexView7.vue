<!-- 병렬 업로드 -->
<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileSelect" multiple style="display: none;" />
    <button @click="openFileDialog">Select Files</button>

    <div class="file-list">
      <div v-for="(file, index) in files" :key="file.uniqueId" class="file-item">
        <span class="file-name">{{ truncateFileName(file.name) }}</span>
        <span>{{ formatFileSize(file.size) }}</span>
        <button @click="confirmRemoveFile(file)">
          <img src="path/to/delete-icon.png" alt="Remove" />
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
import axios from 'axios'

const files = ref([])
const newFiles = ref([])
const uploadProgresses = ref([])

const fileInput = ref(null)

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  const processedFiles = selectedFiles.map(file => ({
    ...file,
    uniqueId: `${file.name}_${file.lastModified}`
  }))
  const existingFileIds = new Set(files.value.map(file => file.uniqueId))
  const addedFiles = processedFiles.filter(file => !existingFileIds.has(file.uniqueId))

  if (addedFiles.length > 0) {
    newFiles.value.push(...addedFiles)
    files.value.push(...addedFiles)
    uploadProgresses.value.push(...Array(addedFiles.length).fill(0))
  }
}

const confirmRemoveFile = (file) => {
  const isNewFile = newFiles.value.some(newFile => newFile.uniqueId === file.uniqueId)
  const message = isNewFile ? 'New file' : 'Existing file'
  alert(`${message} - Deletion action will not be performed.`)
}

const openFileDialog = () => {
  fileInput.value.click()
}

const formatFileSize = (size) => {
  const kSize = size / 1024
  return kSize.toLocaleString() + ' KB'
}

const truncateFileName = (name) => {
  const maxLength = 30
  if (name.length > maxLength) {
    return name.slice(0, maxLength) + '...'
  }
  return name
}

const clearFiles = () => {
  files.value = []
  newFiles.value = []
  uploadProgresses.value = []
}

const uploadFileChunks = async (file, index) => {
  const partSize = 10 * 1024 * 1024 // 10MB
  const partCount = Math.ceil(file.size / partSize)
  const parts = []

  try {
    // 백엔드에서 presigned URL 가져오기
    const response = await axios.post('/api/presigned-url', null, {
      params: { fileName: file.name, partCount }
    })
    const { uploadId, presignedUrls } = response.data

    for (let partNumber = 1; partNumber <= partCount; partNumber++) {
      const start = (partNumber - 1) * partSize
      const end = partNumber * partSize
      const blob = file.slice(start, end)

      // presigned URL을 이용하여 S3에 파일 업로드
      const { headers } = await axios.put(presignedUrls[partNumber - 1], blob, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded + start
          uploadProgresses.value[index] = Math.round((loaded / file.size) * 100)
        }
      })

      parts.push({
        ETag: headers.etag,
        PartNumber: partNumber
      })
    }

    // 파일 정보 백엔드에 저장
    await axios.post('/api/complete-multipart-upload', {
      Bucket: 'your-bucket-name',
      Key: file.name,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts
      }
    })

  } catch (error) {
    console.error('Error uploading file:', file.name, error)
  }
}

const uploadFiles = async () => {
  const uploadPromises = newFiles.value.map((file, index) => uploadFileChunks(file, index))
  await Promise.all(uploadPromises)

  if (uploadProgresses.value.every(progress => progress === 100)) {
    alert('All new files uploaded successfully!')
  }

  newFiles.value = []
}
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