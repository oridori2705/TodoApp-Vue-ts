<script setup lang="ts">
import TodoCreator from '~/components/TodoCreator.vue'
import TodoList from '~/components/TodoList.vue'
</script>

<template>
  <main>
    <TodoCreator />
    <TodoList />
  </main>
  <!-- routes의 children에 있는 컴포넌트를 출력하기 위해서 작성해야함 -->
  <RouterView />
</template>
