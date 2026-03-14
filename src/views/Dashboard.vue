<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '../services/auth'

const router = useRouter()
const documents = ref([])
const fileInput = ref(null)
const isUploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref('')

async function loadDocuments() {
  try {
    const res = await fetch('/api/manual_uploads')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    documents.value = (data.documents ?? []).map((d) => ({
      key: d.source_name + d.upload_date,
      name: d.document_name || '-',
      date: d.upload_date ? new Date(d.upload_date).toLocaleString() : '-',
      type: (d.file_type || '-').toUpperCase(),
      size: d.file_size > 0 ? `${(d.file_size / 1048576).toFixed(2)} MB` : '-',
      chunks: d.chunks_count ?? 0,
    }))
  } catch (error) {
    console.error('Failed to load documents:', error)
    uploadError.value = 'Failed to load documents from API.'
  }
}

function openFilePicker() {
  if (isUploading.value) return
  uploadError.value = ''
  uploadSuccess.value = ''
  fileInput.value?.click()
}

function isPdfFile(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

async function uploadDocument(file) {
  if (isUploading.value) return
  isUploading.value = true
  uploadError.value = ''
  uploadSuccess.value = ''

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch('/local-api/upload_pdf', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Upload failed')

    uploadSuccess.value = 'PDF uploaded successfully.'
    await loadDocuments()
  } catch {
    uploadError.value = 'Failed to upload PDF. Please try again.'
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleFileSelected(event) {
  const selectedFile = event.target.files?.[0]
  if (!selectedFile) return

  if (!isPdfFile(selectedFile)) {
    uploadError.value = 'Only PDF files are allowed.'
    uploadSuccess.value = ''
    event.target.value = ''
    return
  }

  await uploadDocument(selectedFile)
}

onMounted(loadDocuments)

async function logout() {
  clearAuth()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="page-shell">
    <!-- Header -->
    <header class="page-header">
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <button
          type="button"
          class="rounded-md border border-white/70 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/15"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="page-sidebar">
        <nav class="py-4">
          <RouterLink to="/" class="nav-item-active"> Dashboard </RouterLink>
          <RouterLink to="/web-scraper" class="nav-item"> Web Scraper </RouterLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-8">
        <div class="page-content-card">
          <!-- Header Section -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Knowledge Base Management</h2>
            <button
              class="btn-primary flex items-center gap-2"
              :disabled="isUploading"
              @click="openFilePicker"
            >
              {{ isUploading ? 'Uploading...' : 'Upload Document' }}
            </button>
            <input
              ref="fileInput"
              type="file"
              accept=".pdf,application/pdf"
              class="hidden"
              @change="handleFileSelected"
            />
          </div>

          <p v-if="uploadError" class="mb-4 text-sm text-red-600">{{ uploadError }}</p>
          <p v-else-if="uploadSuccess" class="mb-4 text-sm text-green-700">{{ uploadSuccess }}</p>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="table-head-cell">Document Name</th>
                  <th class="table-head-cell">Upload Date</th>
                  <th class="table-head-cell">File Type</th>
                  <th class="table-head-cell">Chunks</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="documents.length">
                  <tr v-for="doc in documents" :key="doc.key" class="border-b border-gray-200">
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.date }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.type }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.chunks }}</td>
                  </tr>
                </template>
                <tr v-else class="border-b border-gray-200">
                  <td colspan="5" class="px-4 py-6 text-sm text-gray-500">No documents found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
