<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '../services/auth'

// Router instance for navigation
const router = useRouter()

// Web scraper state
const runs = ref([]) // List of scrape run history
const error = ref('') // Error message from scrape operations
const isIndexing = ref(false) // Full scrape in progress flag
const LOCAL_SCRAPER_API_BASE = 'http://127.0.0.1:8000/api' // Local scraper API base URL

// Fetch scrape run history from the API and format for display
async function loadHistory() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/index_database_runs`)
    const data = await res.json()
    runs.value = (data.results ?? []).map((r) => ({
      id: r.id,
      pages: `${r.pages_indexed ?? 0}/${r.total_pages ?? 0} (failed: ${r.pages_failed ?? 0})`,
      pdfs: `${r.pdfs_processed ?? 0}/${r.total_pdfs ?? 0} (failed: ${r.pdfs_failed ?? 0})`,
      date: r.created_at ? new Date(r.created_at).toLocaleString() : '-',
      success: r.success,
      duration:
        r.processing_time_minutes != null ? `${r.processing_time_minutes.toFixed(2)} min` : '-',
      details: r.message || r.error || '-',
    }))
  } catch {
    error.value = 'Failed to load scrape history.'
  }
}

// Trigger full scrape operation and reload history
async function handleFullScrape() {
  if (isIndexing.value) return // Prevent duplicate scrape requests
  isIndexing.value = true
  error.value = ''
  try {
    await fetch(`${LOCAL_SCRAPER_API_BASE}/index_database`, { method: 'POST' })
    await loadHistory()
  } catch {
    error.value = 'Could not trigger full scrape.'
  } finally {
    isIndexing.value = false
  }
}

// Load history when component mounts
onMounted(loadHistory)

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
        <h1 class="text-2xl font-semibold tracking-tight">Web Scraper</h1>
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
          <RouterLink to="/" class="nav-item"> Dashboard </RouterLink>
          <RouterLink to="/web-scraper" class="nav-item-active"> Web Scraper </RouterLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-8">
        <div class="page-content-card">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Scrape TUS Website</h2>
            <button
              class="btn-primary flex items-center gap-2"
              :disabled="isIndexing"
              @click="handleFullScrape"
            >
              Full Scrape
            </button>
          </div>

          <p v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</p>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="table-head-cell">Pages Scraped</th>
                  <th class="table-head-cell">PDF Files Indexed</th>
                  <th class="table-head-cell">Date</th>
                  <th class="table-head-cell">Status</th>
                  <th class="table-head-cell">Time Taken</th>
                  <th class="table-head-cell">Details</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="runs.length">
                  <tr v-for="run in runs" :key="run.id" class="border-b border-gray-200">
                    <td class="px-4 py-3 text-sm text-gray-700">{{ run.pages }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ run.pdfs }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ run.date }}</td>
                    <td
                      class="px-4 py-3 text-sm"
                      :class="run.success ? 'text-green-700' : 'text-red-700'"
                    >
                      {{ run.success ? 'Success' : 'Failed' }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ run.duration }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ run.details }}</td>
                  </tr>
                </template>
                <tr v-else class="border-b border-gray-200">
                  <td colspan="6" class="px-4 py-6 text-sm text-gray-500">No scrape runs found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
