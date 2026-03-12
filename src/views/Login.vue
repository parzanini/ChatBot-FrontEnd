<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAdmin, loginAdmin } from '../services/auth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

function setRouteMessage() {
  const reason = route.query.reason

  if (reason === 'auth') {
    errorMessage.value = 'Please log in to continue.'
    return
  }

  if (reason === 'admin') {
    errorMessage.value = 'Only admin users can access this application.'
    return
  }

  errorMessage.value = ''
}

async function handleSubmit() {
  if (loading.value) {
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    await loginAdmin(email.value.trim(), password.value)
    await router.replace({ name: 'dashboard' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isAdmin()) {
    await router.replace({ name: 'dashboard' })
    return
  }

  setRouteMessage()
})

watch(
  () => route.query.reason,
  () => {
    setRouteMessage()
  },
)
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#e8f4f5_0%,#f3f6f8_42%)] px-4 py-10">
    <div
      class="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
    >
      <h1 class="text-2xl font-semibold text-slate-900 text-center">Chatbot Admin Dashboard</h1>

      <p
        v-if="errorMessage"
        class="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ errorMessage }}
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <label class="block text-sm font-medium text-slate-700">
          Email
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400"
          />
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Password
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400"
          />
        </label>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
