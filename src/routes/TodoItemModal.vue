<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TheIcon from '~/components/TheIcon.vue'
import TheBtn from '~/components/TheBtn.vue'
import { useTodosStore } from '~/store/todos'
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'

const todosStore = useTodosStore()

const editorElement = ref<HTMLDivElement | null>(null)

const updateLoading = ref(false)
const deleteLoading = ref(false)

const router = useRouter()
const route = useRoute()
const foundTodo = todosStore.todos.find(todo => todo.id === route.params.id)
foundTodo ? (todosStore.currentTodo = { ...foundTodo }) : router.push('/')

onMounted(() => {
  editorElement.value?.focus()
  window.addEventListener('keydown', escKeyHandler)
})

onUnmounted(() => {
  window.removeEventListener('keydown', escKeyHandler)
})

function escKeyHandler(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    offModal()
  }
}
function toggleDone() {
  todosStore.currentTodo.done = !todosStore.currentTodo.done
}
function onChange() {
  const title = editorElement.value?.textContent
  if (title && title.trim()) {
    todosStore.currentTodo.title = title
  }
}
function offModal() {
  router.push('/')
}
async function deleteTodo() {
  if (deleteLoading.value) return
  if (updateLoading.value) return
  deleteLoading.value = true
  try {
    await todosStore.deleteTodo({
      id: todosStore.currentTodo.id
    })
    offModal()
  } catch (error) {
    console.error('Error deleting', error)
  } finally {
    deleteLoading.value = false
  }
}
async function updateTodo() {
  if (updateLoading.value) return
  updateLoading.value = true
  try {
    await todosStore.updateTodo({ ...todosStore.currentTodo })
    offModal()
  } catch (error) {
    console.error('Failed to update', error)
  } finally {
    updateLoading.value = false
  }
}
function formatDate(date: string) {
  return dayjs(date).format('YYYY년 M월 D일 H시 m분 ss초')
}
</script>

<template>
  <div class="modal">
    <div
      class="background"
      @click="offModal"></div>
    <div class="contents">
      <div class="todo-head">
        <TheIcon
          :active="todosStore.currentTodo.done"
          @click="toggleDone">
          check
        </TheIcon>
        <div class="btn-group">
          <TheBtn @click="offModal">취소</TheBtn>
          <TheBtn
            danger
            :loading="deleteLoading"
            @click="deleteTodo"
            >삭제</TheBtn
          >
          <TheBtn
            success
            :loading="updateLoading"
            @click="updateTodo"
            >저장</TheBtn
          >
        </div>
      </div>
      <div class="data-group">
        <div class="date">
          생성일:{{ formatDate(todosStore.currentTodo.createdAt) }}
        </div>
        <div
          v-if="
            todosStore.currentTodo.createdAt !==
            todosStore.currentTodo.updatedAt
          "
          class="date">
          수정일:{{ formatDate(todosStore.currentTodo.updatedAt) }}
        </div>
      </div>
      <div
        ref="editorElement"
        class="editor"
        contenteditable
        @blur="onChange"
        @keydown.enter.prevent="onChange(), updateTodo()"
        v-text="todosStore.currentTodo.title"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.7);
  }
  /* 모달에서 내용의 길이에따라 반응형 크기적용하는법 */
  .contents {
    margin: 0 20px;
    width: 100%;
    max-width: 700px;
    max-height: calc(100vh - 40px);
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    position: relative;
    .data-group {
      padding: 30px 30px 0 30px;
      .date {
        color: #ddd;
        font-size: 14px;
        line-height: 1.4;
      }
    }
    .editor {
      padding: 30px;
      line-height: 1.5;
      outline: none;
    }
  }
}
</style>
