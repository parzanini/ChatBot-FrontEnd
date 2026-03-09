<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-[#4A9CA6] text-white py-4 px-6 shadow-md">
      <h1 class="text-2xl font-semibold">Admin Dashboard</h1>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-48 bg-gray-200 min-h-[calc(100vh-64px)]">
        <nav class="py-4">
          <a
            href="#"
            class="block px-6 py-3 text-[#4A9CA6] font-medium bg-white border-l-4 border-[#4A9CA6]"
          >
            Dashboard
          </a>
          <a href="#" class="block px-6 py-3 text-gray-700 hover:bg-gray-300 transition">
            Web Scraper
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <!-- Header Section -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Knowledge Base Management</h2>
            <button
              @click="uploadDocument"
              class="bg-[#4A9CA6] hover:bg-[#3d8891] text-white font-semibold px-6 py-2 rounded-md transition flex items-center gap-2"
            >
              <span class="text-lg">+</span>
              Upload Document
            </button>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    Document Name
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    Upload Date
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    File Type
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">
                    File Size
                  </th>
                  <th class="text-left py-3 px-4 text-sm font-semibold text-[#4A9CA6]">Actions</th>
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
