<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
function uploadDocument() {
  console.info('Upload document action is not implemented yet.')
}
</script>

<template>
  <div class="page-shell">
    <!-- Header -->
    <header class="page-header">
      <h1 class="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
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
            <button @click="uploadDocument" class="btn-primary flex items-center gap-2">
              Upload Document
            </button>
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
                  <th class="table-head-cell">Actions</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
