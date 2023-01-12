<script lang="ts">
export const wrapperProps = {
  label: { type: String, default: '' },
  id: { type: String, default: '' },
  error: { type: String, default: '' },
  compact: Boolean,
  reverse: Boolean,
  blank: Boolean,
  full: Boolean,
  disabled: Boolean,
};
export default {
  props: wrapperProps,
};
</script>

<template>
  <div
    :class="{
      'field-wrapper': true,
      hasError: !!error,
      compact,
      reverse,
      blank,
      full,
      disabled,
    }"
  >
    <label :for="id" class="label" :title="label">{{ label }}</label>
    <div class="control">
      <slot></slot>
    </div>
  </div>
  <div v-if="!!error" class="error" :title="error">{{ error }}</div>
</template>

<style scoped lang="scss">
.field-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 4px;
  margin-bottom: 8px;
  &.hasError {
    margin-bottom: 0px;
    .control {
      border-color: red;
    }
  }
  &.compact {
    flex-direction: row;
    .label {
      line-height: 1.8rem;
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    column-gap: 10px;
    align-items: center;
  }
  &.compact.reverse {
    flex-direction: row-reverse;
    justify-content: flex-start;
    .control {
      flex-grow: 0;
    }

    .label {
      flex-grow: 1;
    }
  }
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:not(.blank) {
    .control {
      border: 1px solid #555;
      background: var(--c-default-background-80);
    }
  }
  &:not(.blank),
  &:not(.disabled) {
    .control {
      &:hover {
        background: var(--c-default-background-60);
      }
      &:focus-within {
        border: 1px solid #666;
        background: var(--c-default-background-120);
      }
    }
  }
}

.label {
  font-size: 1.5rem;
  line-height: 1.5rem;
  vertical-align: middle;
}

.full > .control {
  width: 100%;
}
.control {
  display: flex;
}

.error {
  margin: 2px 0 0px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.4rem;
  line-height: 1.8rem;
  color: red;
}
</style>
