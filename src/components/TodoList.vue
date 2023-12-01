<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import { useTodosStore } from '~/store/todos'

const todosStore = useTodosStore()

todosStore.fetchTodos()
</script>

<template>
  <div class="todo-list">
    <TodoItem
      v-for="todo in todosStore.todos"
      :key="todo.id"
      :todo="todo" />
  </div>
</template>

<style lang="scss" scoped></style>
