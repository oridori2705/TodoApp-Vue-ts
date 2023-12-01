import { defineStore } from 'pinia'
import axios from 'axios'

export type Todos = Todo[] // 할 일 목록

export interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}

interface CreateTodoPayload {
  title: string
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todos
  }),
  getters: {},
  actions: {
    async createTodo({ title }: CreateTodoPayload) {
      try {
        const { data: createdTodo } = await axios.post('/api/todos', {
          method: 'POST',
          data: {
            title
          }
        })
        this.todos.unshift(createdTodo)
      } catch (error) {
        console.error('createTodo failed', error)
      }
    },
    async fetchTodos() {
      const { data } = await axios.post('/api/todos', {
        method: 'GET'
      })
      this.todos = data
    },
    async updateTodo(todo: Todo) {
      //낙관적 업데이트
      const foundTodo = this.todos.find(t => t.id === todo.id)
      if (!foundTodo) return
      const backedUpTodo = { ...foundTodo } // API 요청 실패시 복원데이터
      Object.assign(foundTodo, todo)
      try {
        const { id: path, title, done } = todo
        const { data: updatedTodo } = await axios.post(`/api/todos/`, {
          method: 'PUT',
          path,
          data: {
            title,
            done
          }
        })
      } catch (error) {
        console.error('updateTodo:', error)
        Object.assign(foundTodo, backedUpTodo)
      }
    },
    updateCheckboxes(done: boolean) {
      //async/await를 붙이지 않은 이유는 병렬적으로 요쳥을 보내기 위해서
      this.todos.forEach(todo => {
        this.updateTodo({
          ...todo,
          done
        })
      })
    }
  }
})
