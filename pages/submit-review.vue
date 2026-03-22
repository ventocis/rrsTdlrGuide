<script setup lang="ts">
import type { Provider } from '~/composables/useProviders'
import providersRaw from '~/data/providers.json'

const config = useRuntimeConfig()
const formAction = config.public?.formAction as string || 'https://formspree.io/f/maqpolpb'
const recaptchaSiteKey = (config.public?.recaptchaSiteKey as string) || ''

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  script: recaptchaSiteKey
    ? [{ src: `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`, async: true, defer: true }]
    : []
})

const submitted = ref(false)
const submitting = ref(false)
const error = ref('')

type CourseMode = 'existing' | 'new'
const courseMode = ref<CourseMode>('existing')
const selectedProvider = ref<{ id: number; name: string } | null>(null)
const providerSearch = ref('')
const newCourseName = ref('')
const newCourseLicense = ref('')
const rating = ref<number | ''>('')
const format = ref('')
const language = ref('')
const cert = ref('')

const providerList = (providersRaw as Provider[]).map((p) => ({ id: p.id, name: p.name }))
const filteredProviders = computed(() => {
  const q = providerSearch.value.trim().toLowerCase()
  if (!q) return providerList.slice(0, 50)
  return providerList.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 50)
})
const showProviderDropdown = ref(false)

function selectProvider(p: { id: number; name: string }) {
  selectedProvider.value = p
  providerSearch.value = p.name
  showProviderDropdown.value = false
}

function clearProvider() {
  selectedProvider.value = null
  providerSearch.value = ''
}

const formatOptions = [
  { value: 'Online', label: 'Online' },
  { value: 'In-Person', label: 'In-Person' },
  { value: 'Online / In-Person', label: 'Online / In-Person' }
] as const

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Eng / Spanish', label: 'Eng / Spanish' },
  { value: 'Other', label: 'Other' }
] as const

const certOptions = [
  { value: 'Free', label: 'Free/Included' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Mail', label: 'Mail' }
] as const

function validateCourse(): boolean {
  if (courseMode.value === 'existing') {
    return !!selectedProvider.value
  }
  return !!newCourseName.value.trim() && !!newCourseLicense.value.trim()
}

function validateForm(): string | null {
  if (!validateCourse()) {
    return 'Please select an existing course or enter a new course name and CP license number.'
  }
  if (!rating.value || rating.value < 1 || rating.value > 5) {
    return 'Please rate the course (1–5).'
  }
  if (!format.value?.trim()) {
    return 'Please select a format (Online, In-Person, or both).'
  }
  if (!language.value?.trim()) {
    return 'Please select a language.'
  }
  if (!cert.value?.trim()) {
    return 'Please select how the certificate was delivered.'
  }
  return null
}

function syncHiddenCourseFields(form: HTMLFormElement) {
  const set = (name: string, value: string) => {
    const el = form.querySelector(`input[name="${name}"]`) as HTMLInputElement | null
    if (el) el.value = value
  }
  set('course_type', courseMode.value)
  if (courseMode.value === 'existing' && selectedProvider.value) {
    set('provider_or_course', selectedProvider.value.name)
    set('provider_name', selectedProvider.value.name)
    set('provider_id', String(selectedProvider.value.id))
    set('provider_license', '')
  } else {
    set('provider_or_course', newCourseName.value.trim())
    set('provider_license', newCourseLicense.value.trim())
    set('provider_name', '')
    set('provider_id', '')
  }
}

async function onSubmit(e: Event) {
  const form = e.target as HTMLFormElement
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }
  error.value = ''
  submitting.value = true
  syncHiddenCourseFields(form)
  form.action = formAction
  form.method = 'post'
  form.target = '_blank'

  if (recaptchaSiteKey && typeof window !== 'undefined' && (window as unknown as { grecaptcha?: { execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha) {
    try {
      const grecaptcha = (window as unknown as { grecaptcha: { execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha
      const token = await grecaptcha.execute(recaptchaSiteKey, { action: 'submit' })
      let el = form.querySelector('input[name="g-recaptcha-response"]') as HTMLInputElement | null
      if (!el) {
        el = document.createElement('input')
        el.type = 'hidden'
        el.name = 'g-recaptcha-response'
        form.appendChild(el)
      }
      el.value = token
    } catch (_) {
      // If reCAPTCHA fails, submit anyway so Formspree can show their own challenge
    }
  }

  form.submit()
  submitted.value = true
  submitting.value = false
}
</script>

<template>
  <div
    class="min-h-screen font-['DM_Sans',system-ui,sans-serif]"
    style="background-color: var(--proto-page-bg);"
  >
    <SiteHeader />
    <main class="mx-auto w-full max-w-[1600px] px-4 py-10 sm:px-6">
      <div
        class="mx-auto max-w-lg rounded-xl border bg-white p-6 shadow-sm sm:p-8"
        style="border-color: var(--proto-card-border);"
      >
        <h1 class="mb-1 text-xl font-bold" style="color: var(--proto-text);">
          Submit a review or correction
        </h1>
        <p class="mb-6 text-[14px]" style="color: var(--proto-text-muted);">
          Share the total price you paid and rate the course. We use this to keep the guide accurate.
        </p>

        <form
          v-if="!submitted"
          method="post"
          class="space-y-5"
          @submit.prevent="onSubmit"
        >
          <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {{ error }}
          </div>
          <input type="hidden" name="_subject" value="TDLR Guide – Review / Correction" />
          <input type="hidden" name="course_type" />
          <input type="hidden" name="provider_or_course" />
          <input type="hidden" name="provider_name" />
          <input type="hidden" name="provider_id" />
          <input type="hidden" name="provider_license" />

          <!-- reCAPTCHA token (set by JS when recaptchaSiteKey is configured) -->
          <input v-if="recaptchaSiteKey" type="hidden" name="g-recaptcha-response" />

          <!-- Course selection -->
          <div>
            <label class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Course <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4 mb-3">
              <label class="flex cursor-pointer items-center gap-2">
                <input
                  v-model="courseMode"
                  type="radio"
                  value="existing"
                  class="rounded border-gray-300"
                />
                <span class="text-[14px]" style="color: var(--proto-text);">Select existing course</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2">
                <input
                  v-model="courseMode"
                  type="radio"
                  value="new"
                  class="rounded border-gray-300"
                />
                <span class="text-[14px]" style="color: var(--proto-text);">Add new course</span>
              </label>
            </div>

            <!-- Existing: search/select -->
            <template v-if="courseMode === 'existing'">
              <div class="relative">
                <input
                  v-model="providerSearch"
                  type="text"
                  autocomplete="off"
                  placeholder="Search for your course..."
                  class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
                  style="border-color: var(--proto-card-border); color: var(--proto-text);"
                  @focus="showProviderDropdown = true"
                  @blur="setTimeout(() => { showProviderDropdown = false }, 200)"
                />
                <button
                  v-if="selectedProvider"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] font-semibold"
                  style="color: var(--proto-teal);"
                  @click.prevent="clearProvider"
                >
                  Clear
                </button>
                <ul
                  v-if="showProviderDropdown && filteredProviders.length"
                  class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border py-1 shadow-lg"
                  style="border-color: var(--proto-card-border); background: white;"
                >
                  <li
                    v-for="p in filteredProviders"
                    :key="p.id"
                    class="cursor-pointer px-3 py-2 text-[14px] hover:bg-gray-100"
                    style="color: var(--proto-text);"
                    @mousedown.prevent="selectProvider(p)"
                  >
                    {{ p.name }}
                  </li>
                </ul>
              </div>
            </template>

            <!-- New: name + CP license -->
            <template v-else>
              <div class="space-y-3">
                <div>
                  <label for="new_course_name" class="mb-1 block text-[12px] font-medium" style="color: var(--proto-text-muted);">
                    Course / provider name
                  </label>
                  <input
                    id="new_course_name"
                    v-model="newCourseName"
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
                    style="border-color: var(--proto-card-border); color: var(--proto-text);"
                    placeholder="e.g. My Driving School"
                  />
                </div>
                <div>
                  <label for="new_course_license" class="mb-1 block text-[12px] font-medium" style="color: var(--proto-text-muted);">
                    CP license number for this course
                  </label>
                  <input
                    id="new_course_license"
                    v-model="newCourseLicense"
                    type="text"
                    class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
                    style="border-color: var(--proto-card-border); color: var(--proto-text);"
                    placeholder="e.g. CP028"
                  />
                </div>
              </div>
            </template>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="first_name" class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
                style="border-color: var(--proto-card-border); color: var(--proto-text);"
                placeholder="Jane"
              />
            </div>
            <div>
              <label for="last_name" class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
                style="border-color: var(--proto-card-border); color: var(--proto-text);"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label for="license_cp" class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              License CP number on your certificate (optional)
            </label>
            <input
              id="license_cp"
              name="license_cp"
              type="text"
              class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
              placeholder="e.g. CP028"
            />
          </div>

          <div>
            <label for="total_paid" class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Total price you paid (optional)
            </label>
            <input
              id="total_paid"
              name="total_price_paid"
              type="text"
              inputmode="decimal"
              class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
              placeholder="e.g. 28.00"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Format <span class="text-red-500">*</span>
            </label>
            <select
              v-model="format"
              name="format"
              required
              class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
            >
              <option value="">Select format</option>
              <option v-for="opt in formatOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Language <span class="text-red-500">*</span>
            </label>
            <select
              v-model="language"
              name="language"
              required
              class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
            >
              <option value="">Select language</option>
              <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Certificate <span class="text-red-500">*</span>
            </label>
            <select
              v-model="cert"
              name="cert"
              required
              class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
            >
              <option value="">How was certificate delivered?</option>
              <option v-for="opt in certOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Rate the course (1–5) <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <label
                v-for="n in 5"
                :key="n"
                class="cursor-pointer rounded-lg border px-3 py-2 text-[14px] font-medium transition-colors"
                :class="rating === n
                  ? 'border-[var(--proto-teal)] bg-[var(--proto-teal-bg)] text-[var(--proto-teal)]'
                  : 'border-[var(--proto-card-border)] text-[var(--proto-text-muted)]'"
              >
                <input
                  v-model="rating"
                  type="radio"
                  :value="n"
                  name="rating"
                  class="sr-only"
                />
                {{ n }}
              </label>
            </div>
          </div>

          <div>
            <label for="notes" class="mb-1.5 block text-[13px] font-semibold" style="color: var(--proto-text);">
              Additional notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              class="w-full rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors focus:ring-2"
              style="border-color: var(--proto-card-border); color: var(--proto-text);"
              placeholder="Any correction or comment..."
            />
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style="background: var(--proto-teal);"
            >
              {{ submitting ? 'Submitting…' : 'Submit' }}
            </button>
            <NuxtLink
              to="/"
              class="rounded-lg border px-4 py-2.5 text-[14px] font-semibold transition-colors"
              style="border-color: var(--proto-card-border); color: var(--proto-text-muted);"
            >
              Back to guide
            </NuxtLink>
          </div>
        </form>

        <div v-else class="rounded-lg border p-4" style="border-color: var(--proto-teal-border); background: var(--proto-teal-bg);">
          <p class="mb-2 font-semibold" style="color: var(--proto-teal);">
            Form sent
          </p>
          <p class="text-[14px]" style="color: var(--proto-text-muted);">
            Your review was submitted in a new tab. Check that tab for Formspree’s confirmation.
          </p>
          <NuxtLink
            to="/"
            class="mt-3 inline-block text-[14px] font-semibold"
            style="color: var(--proto-teal);"
          >
            ← Back to guide
          </NuxtLink>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
