<script setup lang="ts">
import { ref, toRef, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { EditorView, Decoration } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";

const modelValue = defineModel<string>();
const props = defineProps<{ lineIndex: number }>();

const editorView = ref<EditorView>();
const setEditorView = (payload: { view: EditorView }) => {
  editorView.value = payload.view;
};

const lineHighlightMark = Decoration.line({
  attributes: { style: "background-color: lightblue" },
});

const addLineHighlight = StateEffect.define<number>();

const lineHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(lines, tr) {
    lines = lines.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(addLineHighlight)) {
        lines = Decoration.none;
        lines = lines.update({ add: [lineHighlightMark.range(e.value)] });
      }
    }
    return lines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const highlightLine = ([lineIndex, editorView]: [
  number,
  EditorView | undefined
]) => {
  if (!editorView) return;
  const docPosition = editorView.state.doc.line(lineIndex + 1).from;
  editorView.dispatch({ effects: addLineHighlight.of(docPosition) });
};

const lineIndex = toRef(props, "lineIndex");
watch([lineIndex, editorView], highlightLine, { immediate: true });
</script>

<template>
  <codemirror
    v-model="modelValue"
    :extensions="[lineHighlightField]"
    placeholder="Code goes here..."
    :style="{ height: '400px', width: '100%' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    @ready="setEditorView"
  />
</template>

<style>
.highlight {
  background-color: red;
}
</style>
