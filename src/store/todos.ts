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

type FilterStatus = 'all' | 'todo' | 'done'
type Filters = Filter[]
interface Filter {
  label: string
  name: FilterStatus
}
interface CreateTodoPayload {
  title: string
}
interface DeleteTodoPayLoad {
  id: string
}
interface ReorderTodosPayload {
  oldIndex: number
  newIndex: number
}

//초기화되는 데이터가 복잡하면 아래처럼 변수로 뽑아서 type을 지정해주는 것이 좋다.
//as로 단언하게 되면 속성에 오타가 있어도 typescript에서 에러를 발생시키지 않는다.
const filters: Filters = [
  {
    label: '전체',
    name: 'all'
  },
  { label: '할 일만', name: 'todo' },
  { label: '완료만', name: 'done' }
]

const currentTodo: Todo = {
  id: '',
  order: 0,
  title: '',
  done: false,
  createdAt: '',
  updatedAt: ''
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todos,
    filterStatus: 'all' as FilterStatus,
    filters,
    currentTodo,
    loading: false
  }),
  getters: {
    filteredTodos(state) {
      return state.todos.filter(todo => {
        switch (state.filterStatus) {
          case 'todo':
            return !todo.done
          case 'done':
            return todo.done
          case 'all':
          default:
            return true
        }
      })
    }
  },
  actions: {
    async createTodo({ title }: CreateTodoPayload) {
      if (this.loading) return
      this.loading = true
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
      } finally {
        this.loading = false
      }
    },
    async fetchTodos() {
      if (this.loading) return
      this.loading = true
      try {
        const { data } = await axios.post('/api/todos', {
          method: 'GET'
        })
        this.todos = data
      } catch (error) {
        console.error('fetchedTodos failed', error)
      } finally {
        this.loading = false
      }
    },
    async updateTodo(todo: Todo) {
      //낙관적 업데이트
      const foundTodo = this.todos.find(t => t.id === todo.id)
      if (!foundTodo) return
      const backedUpTodo = { ...foundTodo } // API 요청 실패시 복원데이터
      Object.assign(foundTodo, todo) // 참조형이라서..??
      try {
        const { id: path, title, done } = todo
        const { data: updatedTodo } = await axios.post(`/api/todos`, {
          method: 'PUT',
          path,
          data: {
            title,
            done
          }
        })
        //updatedAt만 수정하는 이유는 APi 요청 중에 변경사항이 생겨버리면 덮어씌워지므로

        foundTodo.updatedAt = updatedTodo.updatedAt // 참조형이라서..??
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
    },
    async deleteTodo({ id }: DeleteTodoPayLoad) {
      try {
        await axios.post('/api/todos', {
          method: 'DELETE',
          path: id
        })
        this.todos = this.todos.filter(todo => todo.id !== id)
      } catch (error) {
        console.error('deleteTodo:', error)
      }
    },
    async deleteDoneTodos() {
      const todoIds = this.todos.filter(todo => todo.done).map(todo => todo.id)
      if (!todoIds.length) return

      this.loading = true
      try {
        await axios.post('/api/todos', {
          method: 'DELETE',
          path: 'deletions',
          data: {
            todoIds
          }
        })
        this.todos = this.todos.filter(todo => !todoIds.includes(todo.id))
      } catch (error) {
        console.error('deleteDoneTodos:', error)
      } finally {
        this.loading = false
      }
    },
    async reorderTodos({ oldIndex, newIndex }: ReorderTodosPayload) {
      if (oldIndex === newIndex) return

      this.loading = true
      const movedTodo = this.todos.splice(oldIndex, 1)[0]
      this.todos.splice(newIndex, 0, movedTodo)

      const todoIds = this.todos.map(todo => todo.id)
      try {
        await axios.post('/api/todos', {
          method: 'PUT',
          path: 'reorder',
          data: {
            todoIds
          }
        })
      } catch (error) {
        console.error('reorder error', error)
      } finally {
        this.loading = false
      }
    }
  }
})
