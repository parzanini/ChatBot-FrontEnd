<script setup></script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">🎨 Tailwind CSS is Working!</h1>
      <p class="text-gray-600 mb-6">
        If you can see styled content with colors and shadows, Tailwind is properly configured.
      </p>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-red-500 text-white p-4 rounded-lg text-center font-semibold">Red</div>
        <div class="bg-green-500 text-white p-4 rounded-lg text-center font-semibold">Green</div>
        <div class="bg-blue-500 text-white p-4 rounded-lg text-center font-semibold">Blue</div>
      </div>

      <button
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
      >
        Click Me!
      </button>
    </div>
  </div>
</template>

<style scoped></style>
