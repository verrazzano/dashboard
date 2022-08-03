<script>
// Added by Verrazzano
import { _VIEW } from '@/config/query-params';

// this button fits next to the header at the top of TreeTabbed content

export default {
  name:  'TabDeleteButton',
  props: {
    mode: {
      type:     String,
      required: true,
    },
    elementName: {
      type:     String,
      required: true,
    },
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    },
  },
};
</script>

<template>
  <button
    v-if="!isView"
    v-tooltip="t('verrazzano.common.buttons.deleteElement', { element: elementName })"
    type="button"
    class="btn role-link close btn-sm"
    @click="$emit('click', $event)"
  >
    <i class="icon icon-2x icon-x" />
  </button>
</template>
