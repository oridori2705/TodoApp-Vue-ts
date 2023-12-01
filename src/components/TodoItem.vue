<script setup lang="ts">
import TheIcon from '~/components/TheIcon.vue'
import { computed } from 'vue'
import type { Todo } from '~/store/todos'
import { useTodosStore } from '~/store/todos'

const todosStore = useTodosStore()

const props = defineProps<{
  todo: Todo
}>()
const done = computed({
  get() {
    return props.todo.done
  },
  set(val) {
    todosStore.updateTodo({
      ...props.todo,
      done: val
    })
  }
})

function toggleDone() {
  done.value = !done.value
}
</script>

<template>
  <div class="todo-item">
    <TheIcon
      :active="done"
      @click="toggleDone"
      >check</TheIcon
    >
    <div class="title">{{ todo.title }}</div>
    <div class="drag-handle">
      <span class="material-symbols-outlined">drag_indicator</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-item {
  height: var(--item-height);
  border-bottom: 1px solid var(--border-color);
  padding-left: 80px;
  padding-right: 20px;
  background-color: #fff;
  display: flex;
  align-items: center;
  position: relative;
  gap: 8px;
  :deep(.the-icon) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 24px;
    margin: auto;
  }
  .title {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .drag-handle {
    color: #ddd;
    cursor: move;
  }
}
</style>
