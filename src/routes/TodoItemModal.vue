<script setup lang="ts">
import TheIcon from '~/components/TheIcon.vue'
import TheBtn from '~/components/TheBtn.vue'

function toggleDone() {}
function offModal() {}
function deleteTodo() {}
function updateTodo() {}
</script>

<template>
  <div class="modal">
    <div class="background"></div>
    <div class="contents">
      <div class="todo-head">
        <TheIcon
          :active="false"
          @click="toggleDone">
          check
        </TheIcon>
        <div class="btn-group">
          <TheBtn @click="offModal">취소</TheBtn>
          <TheBtn
            danger
            @click="deleteTodo"
            >삭제</TheBtn
          >
          <TheBtn
            success
            @click="updateTodo"
            >저장</TheBtn
          >
        </div>
      </div>
      <div class="data-group">
        <div class="date">생성일:</div>
        <div class="date">수정일:</div>
      </div>
      <div
        class="editor"
        contenteditable>
        hi
      </div>
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
    width: 100%;
    max-width: 700px;
    max-height: calc(100vh - 40px);
    overflow: auto;
    border-radius: 6px;
    background-color: #fff;
    position: relative;
  }
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
</style>
