<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuth } from '../services/auth'

const isIndexing = ref(false)
const scrapeError = ref('')
const router = useRouter()

async function handleFullScrape() {
  if (isIndexing.value) {
    return
  }

  isIndexing.value = true
  scrapeError.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/index_database', {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`Indexing failed with status ${response.status}`)
    }
  } catch (error) {
    scrapeError.value = 'Could not trigger full scrape. Check backend availability.'
    console.error('Full scrape request failed:', error)
  } finally {
    isIndexing.value = false
  }
}

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

          <p v-if="scrapeError" class="mb-4 text-sm text-red-600">{{ scrapeError }}</p>

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
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
