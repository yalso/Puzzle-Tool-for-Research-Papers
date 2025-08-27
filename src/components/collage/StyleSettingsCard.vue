<template>
  <div class="solid-card p-6 shadow-xl">
    <h2 class="text-xl font-semibold mb-4 border-b border-white/10 pb-2">{{ t('style.title') }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('style.pageMargin') }}</label>
        <input type="number" :value="pageMargin" min="0" class="field" @input="$emit('update:page-margin', Number($event.target.value))" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('style.columnGap') }}</label>
        <input type="number" :value="columnGap" min="0" class="field" @input="$emit('update:column-gap', Number($event.target.value))" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('style.rowGap') }}</label>
        <input type="number" :value="rowGap" min="0" class="field" @input="$emit('update:row-gap', Number($event.target.value))" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('style.footerGap') }}</label>
        <input type="number" :value="footerGap" min="0" class="field" @input="$emit('update:footer-gap', Number($event.target.value))" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('style.fontSize') }}</label>
        <input type="number" :value="fontSize" min="8" class="field" @input="$emit('update:font-size', Number($event.target.value))" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">{{ t('style.bgColor') }}</label>
        <input type="color" :value="bgColor" class="w-full h-10 p-1 bg-white/5 rounded-md cursor-pointer border border-white/20" @input="$emit('update:bg-color', $event.target.value)" />
      </div>
<!--      <div class="col-span-2"> 
        <label class="block text-sm font-medium mb-1">{{ t('style.watermark') }}</label>
        <input type="text" :value="watermarkText" class="field" @input="$emit('update:watermark-text', $event.target.value)" placeholder="e.g., your-website.com" />
      </div> -->
      <div class="col-span-2">
        <label class="inline-flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" :checked="showImageBorder" class="accent-blue-600" @change="$emit('update:show-image-border', $event.target.checked)" />
          <span>{{ t('style.showBorder') }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  t: Function,
  pageMargin: Number, columnGap: Number, rowGap: Number, footerGap: Number, fontSize: Number,
  bgColor: String, watermarkText: String, showImageBorder: Boolean
})

defineEmits([
  'update:page-margin','update:column-gap','update:row-gap','update:footer-gap',
  'update:font-size','update:bg-color','update:watermark-text','update:show-image-border'
])
</script>
