<template>
  <div class="fixed top-4 right-4 flex gap-2 z-20">
    <button @click="$emit('toggle-theme')" class="btn-ghost" :title="theme === 'dark' ? t('toolbar.theme.toLight') : t('toolbar.theme.toDark')">
      <svg v-if="theme==='dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <span class="hidden md:inline">{{ theme === 'dark' ? t('toolbar.theme.darkShort') : t('toolbar.theme.lightShort') }}</span>
    </button>
    <button class="btn-ghost" @click="$emit('toggle-lang')">{{ currentLang === 'zh' ? '中 / EN' : 'EN / 中' }}</button>
  </div>
</template>
<script setup>
defineProps({ t: Function, theme: String, currentLang: String })
defineEmits(['toggle-theme','toggle-lang'])
</script>
