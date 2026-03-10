<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-[#4A9CA6] text-white py-4 px-6 shadow-md">
      <h1 class="text-2xl font-semibold">Web Scraper</h1>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-48 bg-gray-200 min-h-[calc(100vh-64px)]">
        <nav class="py-4">
          <RouterLink
            to="/"
            class="block px-6 py-3 text-gray-700 hover:bg-gray-300 transition"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/web-scraper"
            class="block px-6 py-3 text-[#4A9CA6] font-medium bg-white border-l-4 border-[#4A9CA6]"
          >
            Web Scraper
          </RouterLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Scrape TUS Website</h2>

          <div class="flex items-center justify-between mb-8">
            <p class="text-gray-800 font-semibold text-lg">Scrape the entire website:</p>
            <button
              class="bg-[#4A9CA6] hover:bg-[#3d8891] text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Full Scrape
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    History
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    Date
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="py-3 px-4 text-sm text-gray-700">Full Scrape</td>
                  <td class="py-3 px-4 text-sm text-gray-700">Jan 10, 2026</td>
                  <td class="py-3 px-4 text-sm text-gray-700 pl-4">Success</td>
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
