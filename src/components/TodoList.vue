<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import { useTodosStore } from '~/store/todos'
import { computed, ref, onMounted } from 'vue'
import TheIcon from '~/components/TheIcon.vue'
import { debounce } from 'lodash'
import TheBtn from '~/components/TheBtn.vue'
import Sortable from 'sortablejs'

const todosStore = useTodosStore()

const todoListElement = ref<HTMLDivElement | null>(null)

const debounced = debounce((val: boolean) => {
  todosStore.updateCheckboxes(val)
}, 400)
const isAllChecked = computed({
  get() {
    return todosStore.todos.every(todo => todo.done)
  },
  set(val: boolean) {
    todosStore.todos.forEach(todo => {
      todo.done = val
    })
    debounced(val)
  }
})

todosStore.fetchTodos()

onMounted(() => {
  initSortable()
})

function toggleAllCheckboxes() {
  isAllChecked.value = !isAllChecked.value
}

//1. 내가 재정렬하고자 하는 요소의 부모 요소를 지정해야됨
//2. handle에 내가 핸들링을 수행하는 요소를 지정해줘야함
//3. animation:0 은 애니메이션을 사용하지 않음
//4. forceFallback : 브라우저마다 사용법이 다르고, 일부는 동작안할 수 있는데 이를 보완함
function initSortable() {
  if (todoListElement.value) {
    new Sortable(todoListElement.value, {
      handle: '.drag-handle',
      animation: 0,
      forceFallback: true,
      onEnd: event => {
        //oldIndex에서 newIndex로 이동했다.
        const { oldIndex, newIndex } = event
        todosStore.reorderTodos({
          oldIndex: oldIndex as number,
          newIndex: newIndex as number
        })
      }
    })
  }
}
</script>

<template>
  <div class="todos-wrap shadow">
    <div class="todo-head">
      <TheIcon
        :active="isAllChecked"
        @click="toggleAllCheckboxes"
        >done_all</TheIcon
      >
      <div class="btn-group">
        <TheBtn
          v-for="filter in todosStore.filters"
          :key="filter.name"
          :active="todosStore.filterStatus === filter.name"
          @click="todosStore.filterStatus = filter.name">
          {{ filter.label }}
        </TheBtn>
        <TheBtn
          danger
          @click="todosStore.deleteDoneTodos">
          완료된 할 일 삭제
        </TheBtn>
      </div>
    </div>
    <div
      ref="todoListElement"
      class="todo-list">
      <TodoItem
        v-for="todo in todosStore.filteredTodos"
        :key="todo.id"
        :todo="todo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todos-wrap {
  border-radius: 6px;
  overflow: hidden;
}
.todo-head {
  height: 60px;
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(#fff, 0.9);
  position: relative;
  :deep(.the-icon) {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 24px;
  }
  .btn-group {
    height: 100%;
    display: flex;
    position: absolute;
    right: 0;
  }
}
</style>
