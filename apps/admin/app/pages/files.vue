<script setup lang="ts">
definePageMeta({
  layout: 'default',
  auth: 'authenticated',
  title: '文件',
})

const {
  data: listData,
  loading,
  error: listError,
  send: refresh,
} = useRequest(() => Apis.files.list({ params: { per_page: 100 } }), { immediate: true }).onError(({ error }) =>
  apiErrorToast('文件列表加载失败', error),
)

/** 服务端返回的文件列表，工作台与两张图表卡共用同一份 */
const records = computed(() => listData.value?.files ?? [])
</script>

<template>
  <div class="flex flex-col gap-5">
    <InkPageHeader title="文件" description="上传文件，附加后即可得到可访问的下载链接。" />

    <!-- 工作台自带 omp 卡片外壳，这里不再套一层 -->
    <ConsoleFileWorkbench :records="records" :loading="loading" :error="listError" @refresh="fire(refresh())" />

    <ConsoleUploadTrendCard :records="records" />
    <ConsoleFileTypeCard :records="records" />
  </div>
</template>
