<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '../services/auth'

// Router instance for navigation
const router = useRouter()

// Document management state
const documents = ref([]) // List of uploaded documents
const fileInput = ref(null) // Hidden file input reference
const isUploading = ref(false) // Upload in progress flag
const uploadError = ref('') // Error message from upload/load operations
const uploadSuccess = ref('') // Success message from upload/delete operations
const deletingKey = ref(null) // Track which document is being deleted

// Fetch uploaded documents from the API and format them for display
async function loadDocuments() {
  try {
    const res = await fetch('/api/manual_uploads')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    documents.value = (data.documents ?? []).map((d) => ({
      key: d.source_name + d.upload_date,
      sourceName: d.source_name,
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

// Trigger file picker dialog and clear any existing messages
function openFilePicker() {
  if (isUploading.value) return
  uploadError.value = ''
  uploadSuccess.value = ''
  fileInput.value?.click()
}

// Check if file is a PDF by MIME type or file extension
function isPdfFile(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

// Upload PDF file to the server
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

// Handle file selection from file picker
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

// Delete a document from the knowledge base
async function deleteDocument(sourceName) {
  if (deletingKey.value) return
  deletingKey.value = sourceName
  uploadError.value = ''
  uploadSuccess.value = ''

  try {
    const res = await fetch('/api/manual_uploads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_name: sourceName }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed')

    uploadSuccess.value = `"${sourceName}" deleted successfully.`
    await loadDocuments()
  } catch (error) {
    uploadError.value = error.message || 'Failed to delete document.'
  } finally {
    deletingKey.value = null
  }
}

// Load documents when component mounts
onMounted(loadDocuments)

// Clear auth and redirect to login page
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
                  <th class="table-head-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="documents.length">
                  <tr v-for="doc in documents" :key="doc.key" class="border-b border-gray-200">
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.date }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.type }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.chunks }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                      <button
                        class="rounded px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        :disabled="deletingKey === doc.sourceName"
                        @click="deleteDocument(doc.sourceName)"
                      >
                        {{ deletingKey === doc.sourceName ? 'Deleting...' : 'Delete' }}
                      </button>
                    </td>
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
