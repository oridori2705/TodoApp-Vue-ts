<script setup lang="ts">
import TheIcon from '~/components/TheIcon.vue'
import { ref } from 'vue'
import { useTodosStore } from '~/store/todos'

const title = ref('')
const todosStore = useTodosStore()

async function createTodo(event: MouseEvent | KeyboardEvent) {
  //한글 입력시 브라우저에서 구조화하는 것 때문에 두번 요청이 들어감
  if (event instanceof KeyboardEvent && event.isComposing) return
  if (!title.value.trim()) return
  try {
    await todosStore.createTodo({ title: title.value })
    title.value = ''
  } catch (error) {
    console.error('TodoCreator/createTodo failed')
  }
}
</script>

<template>
  <div class="todo-creator shadow">
    <TheIcon
      active
      @click="createTodo">
      add
    </TheIcon>
    <input
      :value="title"
      placeholder="새로운 할일을 작성하세요.."
      @input="title = ($event.target as HTMLInputElement).value"
      @keydown.enter="createTodo" />
  </div>
</template>

<style lang="scss" scoped>
.todo-creator {
  height: var(--item-height);
  position: relative;
  margin-bottom: 30px;
  :deep(.the-icon) {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 24px;
    z-index: 1;
  }
  input {
    padding: 0 10px 0 80px;
    border: none;
    outline: none;
    border-radius: 6px;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    &::placeholder {
      color: #ccc;
    }
  }
}
</style>
