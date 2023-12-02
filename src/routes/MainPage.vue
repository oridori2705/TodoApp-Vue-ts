<script setup lang="ts">
import TheMessage from '~/components/TheMessage.vue'
import TodoCreator from '~/components/TodoCreator.vue'
import TodoList from '~/components/TodoList.vue'
import { useTodosStore } from '~/store/todos'

const todosStore = useTodosStore()
</script>

<template>
  <main>
    <TodoCreator />
    <TodoList />
    <TheMessage />>
  </main>
  <Transition>
    <!-- routes의 children에 있는 컴포넌트를 출력하기 위해서 작성해야함 -->
    <!--v-if="todosStore.todos.length"의 의미는 만약 모달상태에서 
      새로고침을 하면 할일의 목록을 가져와야 모달에 데이터를 출력할수 있는데(foundTodo)
    가져오는데 시간이 걸리게되고 foundTodo에서는 결국 undefined를 출력해서 루트 경로로 빠지게 된다. 
  그래서  TodoItemModal 컴포넌트를 todos의 데이터가 있을 때만 모달 폼을 보여주게해서 
  foundTodo가 undefined를 할당받지 못하도록 한다.
  -->
    <RouterView v-if="todosStore.todos.length" />
  </Transition>
</template>

<style scoped lang="scss">
.main {
  max-width: 700px;
  margin: 0 auto;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
