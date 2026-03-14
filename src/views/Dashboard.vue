<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '../services/auth'

const router = useRouter()
const documents = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/manual_uploads')
    const data = await res.json()
    documents.value = (data.documents ?? []).map((d) => ({
      key: d.source_name + d.upload_date,
      name: d.document_name || '-',
      date: d.upload_date ? new Date(d.upload_date).toLocaleString() : '-',
      type: (d.file_type || '-').toUpperCase(),
      size: d.file_size > 0 ? `${(d.file_size / 1048576).toFixed(2)} MB` : '-',
      chunks: d.chunks_count ?? 0,
    }))
  } catch {
    console.log('Failed to load documents.')
  }
})

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
            <button class="btn-primary flex items-center gap-2">Upload Document</button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="table-head-cell">Document Name</th>
                  <th class="table-head-cell">Upload Date</th>
                  <th class="table-head-cell">File Type</th>
                  <th class="table-head-cell">File Size</th>
                  <th class="table-head-cell">Chunks</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="documents.length">
                  <tr v-for="doc in documents" :key="doc.key" class="border-b border-gray-200">
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.date }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.type }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ doc.size }}</td>
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
